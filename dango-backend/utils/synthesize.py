import json
import re

from utils.llm import (
    append_message,
    generate_chat_completion,
)
from utils.db import (
    get_history,
    get_all_sheets,
    get_sheet,
    update_client_verification_attempts,
    update_DSL_functions,
)
from utils.log import log_messages
from utils.format_text import (
    format_information,
    format_selected_dsl_grammar,
    format_error_message,
)
from utils.verify_syntax import validate_dsls_format, validate_dsls_functions
from utils.convert2NL import transfer_to_NL


def init_prompt():
    global dsl_grammar
    global plan_system_prompt, plan_user_prompt_template
    global generate_system_prompt_template, generate_user_prompt_template
    global plan_with_error_message_system_prompt, plan_with_error_message_user_prompt_template
    global generate_with_error_message_system_prompt, generate_with_error_message_user_prompt_template
    global add_information_system_prompt, add_information_user_prompt_template
    global translate_DSLs_to_NL_description_prompt
    with open("prompt/synthesize/dsl_grammar.txt", "r") as f:
        dsl_grammar = f.read()
    with open("prompt/synthesize/plan_system.txt", "r") as f:
        plan_system_prompt = f.read().replace("{DSL_GRAMMAR}", dsl_grammar)
    with open("prompt/synthesize/plan_user.txt", "r") as f:
        plan_user_prompt_template = f.read()
    with open("prompt/synthesize/generate_system.txt", "r") as f:
        generate_system_prompt_template = f.read().replace("{DSL_GRAMMAR}", dsl_grammar)
    with open("prompt/synthesize/generate_user.txt", "r") as f:
        generate_user_prompt_template = f.read()
    with open("prompt/synthesize/plan_with_error_message_system.txt", "r") as f:
        plan_with_error_message_system_prompt = f.read().replace(
            "{DSL_GRAMMAR}", dsl_grammar
        )
    with open("prompt/synthesize/plan_with_error_message_user.txt", "r") as f:
        plan_with_error_message_user_prompt_template = f.read()
    with open("prompt/synthesize/generate_with_error_message_system.txt", "r") as f:
        generate_with_error_message_system_prompt = f.read()
    with open("prompt/synthesize/generate_with_error_message_user.txt", "r") as f:
        generate_with_error_message_user_prompt_template = f.read()
    with open("prompt/synthesize/add_information_system.txt", "r") as f:
        add_information_system_prompt = f.read()
    with open("prompt/synthesize/add_information_user.txt", "r") as f:
        add_information_user_prompt_template = f.read()
    with open("prompt/synthesize/translate_DSLs_to_NL_description.txt", "r") as f:
        translate_DSLs_to_NL_description_prompt = f.read()


init_prompt()


def add_more_information(client_id, plan, information):
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

    messages = append_message(add_information_system_prompt, "system", [])
    messages = append_message(
        add_information_user_prompt_template.replace(
            "{INFORMATION}", information
        ).replace("{PLAN}", plan),
        "user",
        messages,
    )

    response = generate_chat_completion(messages, special_type="json_list")
    messages = append_message(response, "assistant", messages)
    log_messages(client_id, "add_information", messages)

    result = ""
    for item in response:
        table_name = item["table_name"]
        label_name = item["label_name"]
        name, version = split_sheet_name(table_name)
        if "_v0" in name:
            name = name.replace("_v0", "")
        data = get_sheet(client_id, name, version)
        result += f'\n3 Examples of "{label_name}" of {table_name}:\n'
        for index, keys in enumerate(data[label_name]):
            if index == 2:
                result += f'"{data[label_name][keys]}"\n\n'
                break
            result += f'"{data[label_name][keys]}", '
    return result


def get_step_by_step_plan(
    client_id, history, summarization, error_list=[], last_plan=None
):
    if len(error_list) == 0:
        plan_user_prompt = plan_user_prompt_template.replace(
            "{USER_INTENTS}", summarization
        ).replace(
            "{INFORMATION}",
            format_information(history["information"], with_table_diff=False),
        )
        messages = append_message(plan_system_prompt, "system", [])
    else:
        plan_user_prompt = (
            plan_with_error_message_user_prompt_template.replace(
                "{USER_INTENTS}", summarization
            )
            .replace(
                "{INFORMATION}",
                format_information(history["information"], with_table_diff=False),
            )
            .replace("{ERROR_MESSAGE}", format_error_message(error_list))
            .replace("{PLAN}", last_plan)
        )
        messages = append_message(plan_with_error_message_system_prompt, "system", [])

    messages = append_message(plan_user_prompt, "user", messages)
    step_by_step_plan = generate_chat_completion(messages, special_type="json_list")
    messages = append_message(step_by_step_plan, "assistant", messages)

    step_by_step_plan_string = "Step-by-step Plan:\n"
    for index, item in enumerate(step_by_step_plan, start=1):
        step_by_step_plan_string += (
            f"{index}: {item['description']} ({item['function']} function)\n"
        )

    function_list = [
        "format",
        "split",
    ]
    for item in step_by_step_plan:
        if item["function"] in function_list:
            step_by_step_plan_string += add_more_information(
                client_id,
                item["description"],
                format_information(history["information"], with_table_diff=False),
            )

    log_messages(client_id, "generate_step_by_step_plan", messages)
    return step_by_step_plan, step_by_step_plan_string


def get_dsls(
    client_id,
    history,
    step_by_step_plan,
    step_by_step_plan_string,
    error_list=[],
):
    funtion_list = []
    for step in step_by_step_plan:
        funtion_list.append(step["function"])

    if len(error_list) == 0:
        generate_user_prompt = generate_user_prompt_template.replace(
            "{PLAN}", step_by_step_plan_string
        ).replace(
            "{INFORMATION}",
            format_information(history["information"], with_table_diff=False),
        )
        generate_system_prompt = generate_system_prompt_template.replace(
            "{SELECTED_DSL_GRAMMAR}", format_selected_dsl_grammar(funtion_list)
        )
        messages = append_message(generate_system_prompt, "system", [])
    else:
        generate_user_prompt = (
            generate_with_error_message_user_prompt_template.replace(
                "{PLAN}", step_by_step_plan_string
            )
            .replace(
                "{INFORMATION}",
                format_information(history["information"], with_table_diff=False),
            )
            .replace("{ERROR_MESSAGE}", format_error_message(error_list))
        )
        messages = append_message(
            generate_with_error_message_system_prompt, "system", []
        )

    messages = append_message(generate_user_prompt, "user", messages)
    generated_dsl = generate_chat_completion(messages, special_type="json_object")
    messages = append_message(generated_dsl, "assistant", messages)
    log_messages(client_id, "generate_dsl", messages)
    return generated_dsl


def verify_syntax(client_id, dsls, error_list):
    all_sheets = get_all_sheets(client_id)
    validate_dsls_format(dsls["program"])
    validate_dsls_functions(dsls["program"], all_sheets, error_list)
    return True


def verify(client_id, dsls):
    error_list = []
    verify_syntax(client_id, dsls, error_list)
    return error_list


def translate_DSLs_to_NL(client_id, dsl_list):
    messages = append_message(translate_DSLs_to_NL_description_prompt, "system", [])
    messages = append_message(json.dumps(dsl_list, indent=4), "user", messages)
    response = generate_chat_completion(messages)
    messages = append_message(response, "assistant", messages)
    log_messages(client_id, "translate_DSLs_to_NL", messages)
    return response


def dsl_synthesize(client_id: str) -> str:
    history = get_history(client_id)
    summarization = history["summary"]
    step_by_step_plan, step_by_step_plan_string = get_step_by_step_plan(
        client_id, history, summarization
    )
    dsls = get_dsls(client_id, history, step_by_step_plan, step_by_step_plan_string)
    error_list = verify(client_id, dsls)
    print("1 run")
    count = 1
    while len(error_list) > 0 and count < 5:
        count += 1
        step_by_step_plan, step_by_step_plan_string = get_step_by_step_plan(
            client_id, history, summarization, error_list, step_by_step_plan_string
        )
        dsls = get_dsls(
            client_id,
            history,
            step_by_step_plan,
            step_by_step_plan_string,
            error_list,
        )
        error_list = verify(client_id, dsls)
        print(f"{count} run")
    print(f"Total count: {count}")
    update_client_verification_attempts(client_id, count)

    for dsl in dsls["program"]:
        dsl["natural_language"] = transfer_to_NL(dsl)
    dsls["natural_language_description"] = translate_DSLs_to_NL(client_id, dsls)
    dsls["step_by_step_plan"] = summarization
    update_DSL_functions(client_id, dsls)
    return dsls
