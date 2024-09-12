import re
import json
import pandas as pd
import numpy as np

from utils.db import (
    upload_sheet,
    upload_sheet_buffer,
    get_sheet,
    get_sheet_buffer,
    get_all_sheet_buffer,
    delete_sheet,
    delete_sheet_buffer,
    get_same_sheet_version,
    find_next_version,
    get_history,
    update_history,
)
from utils.log import log_messages
from utils.llm import (
    append_message,
    generate_chat_completion,
)
from dsl.utils import (
    blank_table,
    pivot_table,
    merge,
    subtable,
    transpose,
    insert,
    drop,
    assign,
    move,
    copy,
    swap,
    rearrange,
    divide,
    fill,
    aggregate,
    test,
    concatenate,
    split,
    format,
    count,
)
from utils.format_text import format_selected_dsl_grammar


def init_prompt():
    global execute_system_template, execute_user_template
    with open("prompt/execute/execute_system.txt", "r") as f:
        execute_system_template = f.read()
    with open("prompt/execute/execute_user.txt", "r") as f:
        execute_user_template = f.read()


def init_template():
    global execution_template
    with open("constant/execution_template.txt", "r") as f:
        execution_template = f.read()


init_prompt()
init_template()


def split_sheet_name(sheet_name):
    # Regular expression to find "v{int}" suffix
    match = re.search(r"_v(\d+)\.csv$", sheet_name)
    if match:
        # Extract base name and version number
        base_name = sheet_name[: match.start()] + ".csv"
        version = int(match.group(1))
    else:
        # No version number present
        base_name = sheet_name
        version = 0

    return base_name, version


def execute_dsl_list(
    client_id, required_tables, dsl_list, step_by_step_plan, DependenciesManager
):
    function_list = []
    dsl_program_list = []
    for dsl in dsl_list:
        function_list.append(dsl["function_name"])
        if "condition" not in dsl:
            dsl_program_list.append(
                {
                    "function_name": dsl["function_name"],
                    "arguments": dsl["arguments"],
                }
            )
        else:
            dsl_program_list.append(
                {
                    "function_name": dsl["function_name"],
                    "arguments": dsl["arguments"],
                    "condition": dsl["condition"],
                }
            )

    selected_dsl_grammar = format_selected_dsl_grammar(function_list)
    execute_system_prompt = execute_system_template.replace(
        "{SELECTED_DSL_GRAMMAR}", selected_dsl_grammar
    )
    execute_user_prompt = (
        execute_user_template.replace("{REQUIRED_TABLES}", json.dumps(required_tables))
        .replace(
            "{DSL_PROGRAM}",
            json.dumps(dsl_program_list, indent=4),
        )
        .replace(
            "{USER_INTENTS}",
            step_by_step_plan,
        )
    )

    messages = append_message(execute_system_prompt, "system", [])
    messages = append_message(execute_user_prompt, "user", messages)
    response = generate_chat_completion(messages)
    messages = append_message(response, "assistant", messages)
    log_messages(client_id, "execute_dsl_list", messages)

    pattern = r"```([^`]+)```"
    program = re.findall(pattern, response, re.DOTALL)[0]

    filled_program = execution_template.replace("{CLIENT_ID}", client_id).replace(
        "{PROGRAM}", program
    )

    print("-------------------------- FILLED PROGRAM --------------------------")
    print(filled_program)
    print("--------------------------------------------------------------------")

    exec(filled_program)

    output = []
    all_sheet_buffer = get_all_sheet_buffer(client_id)
    history = get_history(client_id)

    for table, buffer in all_sheet_buffer:
        delete_sheet_buffer(client_id, table)
        buffer = json.loads(buffer)
        sheet_id, sheet_version = split_sheet_name(table)

        # No data found
        if buffer is None:
            print(f"No data found for table {table}")
            continue

        buffer_is_delete = buffer["is_delete"]

        # Delete table data
        if buffer_is_delete:
            output.append(
                {
                    "sheet_id": sheet_id,
                    "version": sheet_version,
                    "data": [],
                    "is_delete": True,
                    "is_new": False,
                }
            )
            continue

        buffer_sheet_data = buffer["data"]

        # Same table data
        same_sheet_version = get_same_sheet_version(
            client_id, sheet_id, buffer_sheet_data
        )
        sheet = pd.DataFrame(buffer_sheet_data)
        if "Unnamed: 0" in sheet.columns:
            sheet = pd.DataFrame(buffer_sheet_data, index_col=0)
        if same_sheet_version is not None:
            print(f"Sheet {sheet_id} already exists in version {same_sheet_version}")
            history["chat_history"].append(
                {
                    "role": "system",
                    "message": f"Output table already exists in {sheet_id[:-4]}_v{same_sheet_version}.csv",
                }
            )
            update_history(client_id, history)
            output.append(
                {
                    "sheet_id": sheet_id,
                    "version": same_sheet_version,
                    "data": sheet.fillna("").to_dict(orient="list"),
                    "is_delete": False,
                    "is_new": True,
                }
            )
            continue

        # New table data
        sheet_version = find_next_version(client_id, sheet_id)
        history["chat_history"].append(
            {
                "role": "system",
                "message": f"Output table {sheet_id[:-4]}_v{sheet_version}.csv",
            }
        )
        output.append(
            {
                "sheet_id": sheet_id,
                "version": sheet_version,
                "data": sheet.fillna("").to_dict(orient="list"),
                "is_delete": False,
                "is_new": False,
            }
        )
        upload_sheet(client_id, sheet_id, sheet_version, buffer_sheet_data)

    update_history(client_id, history)
    for dsl in dsl_list:
        function = dsl["function_name"]
        arguments = dsl["arguments"]

        # Handle divide statement
        if function == "divide" and len(dsl_list) == 1:
            DependenciesManager.handle_divide_statement(arguments, output_tables=output)
            continue

        DependenciesManager.update_dependency(function, arguments)
    return output
