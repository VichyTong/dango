from typing import List
import json
import re

from utils.llm import (
    generate_chat_completion,
    append_message,
)
from utils.log import log_messages, log_text, log_warn
from utils.db import update_history, get_history
from utils.format_text import get_history_text, format_multiple_choices_question
from config.config import config


def init_prompt():
    global transfer_system_prompt, transfer_user_template
    global init_system_prompt, init_system_prompt_without_CQ, followup_system_prompt
    global sheet_state_template, table_diff_template
    with open("prompt/multi_analyze/transfer_meta_diff_to_NL_system.txt", "r") as f:
        transfer_system_prompt = f.read()
    with open("prompt/multi_analyze/transfer_meta_diff_to_NL_user.txt", "r") as f:
        transfer_user_template = f.read()
    with open("prompt/multi_analyze/init_system.txt") as f:
        init_system_prompt = f.read()
    with open("prompt/multi_analyze/init_system_without_CQ.txt") as f:
        init_system_prompt_without_CQ = f.read()
    with open("prompt/multi_analyze/followup_system.txt") as f:
        followup_system_prompt = f.read()
    with open("prompt/template/sheet_state.txt") as f:
        sheet_state_template = f.read()
    with open("prompt/template/table_diff.txt") as f:
        table_diff_template = f.read()


init_prompt()


def extract_changes(client_id, data):
    lines = data.strip().split("\n")
    changes = []

    # change pattern
    pattern_1 = r"Row:\s*(.+?),\s*Col:\s*(.+?),\s*Old:\s*(.+?),\s*New:\s*(.+)"
    # create row pattern
    pattern_2 = r"Inserted row at index (\d+)"
    # create column pattern
    pattern_3 = r"Inserted column at index (\d+)"
    # copy data pattern
    pattern_4 = r"Copied data from column (\d+), row (\d+), to column (\d+), row (\d+) in (.+)\.csv"
    # paste data pattern
    pattern_5 = r"Pasted data from column (\d+), row (\d+), to column (\d+), row (\d+) in (.+)\.csv"
    # move data pattern
    pattern_6 = r"Moved column from index (\d+) to index (\d+)"

    for line in lines:
        match_1 = re.match(pattern_1, line)
        if match_1:
            change = {
                "type": "change_cell",
                "row": int(match_1.group(1)),
                "col": int(match_1.group(2)) + 1,
                "old_value": match_1.group(3),
                "new_value": match_1.group(4),
            }
            changes.append(change)
            continue

        match_2 = re.match(pattern_2, line)
        if match_2:
            change = {
                "type": "insert_row",
                "row": int(match_2.group(1)),
            }
            changes.append(change)
            continue

        match_3 = re.match(pattern_3, line)
        if match_3:
            change = {
                "type": "insert_column",
                "col": int(match_3.group(1)) + 1,
            }
            changes.append(change)
            continue

        match_4 = re.match(pattern_4, line)
        if match_4:
            change = {
                "type": "copy_data",
                "start_col": int(match_4.group(1)) + 1,
                "start_row": int(match_4.group(2)),
                "end_col": int(match_4.group(3)) + 1,
                "end_row": int(match_4.group(4)),
            }
            changes.append(change)
            continue

        match_5 = re.match(pattern_5, line)
        if match_5:
            change = {
                "type": "paste_data",
                "start_col": int(match_5.group(1)) + 1,
                "start_row": int(match_5.group(2)),
                "end_col": int(match_5.group(3)) + 1,
                "end_row": int(match_5.group(4)),
            }
            changes.append(change)
            continue

        match_6 = re.match(pattern_6, line)
        if match_6:
            change = {
                "type": "move_column",
                "start_col": int(match_6.group(1)) + 1,
                "end_col": int(match_6.group(2)) + 1,
            }
            changes.append(change)
            continue

        log_warn(client_id, f">>> extract_changes\nUnrecognized line: {line}")

    return changes


def find_batch_operation(client_id, changes, num_rows, num_cols):
    batch_operations = []
    changes_copy = changes[:]  # Copy the original list to track positions

    # 1. batch insert row operations
    next_index = num_rows + 1
    for change in changes:
        if change["type"] == "insert_row":
            if change["row"] == next_index:
                next_index += 1

    if next_index != num_rows + 1:
        batch_op = {
            "type": "insert_multi_rows",
            "start_row": num_rows + 1,
            "end_row": next_index - 1,
        }
        # Replace all insert_row operations with batch_op
        for i, change in enumerate(changes_copy):
            if change["type"] == "insert_row":
                changes_copy[i] = batch_op
        batch_operations.append(batch_op)
    num_rows = next_index - 1

    # 2. batch insert column operations
    next_index = num_cols + 1
    for change in changes:
        if change["type"] == "insert_col":
            if change["col"] == next_index:
                next_index += 1

    if next_index != num_cols + 1:
        batch_op = {
            "type": "insert_multi_cols",
            "start_col": num_cols + 1,
            "end_col": next_index - 1,
        }
        # Replace all insert_col operations with batch_op
        for i, change in enumerate(changes_copy):
            if change["type"] == "insert_col":
                changes_copy[i] = batch_op
        batch_operations.append(batch_op)
    num_cols = next_index - 1

    # 3. batch change operations
    col_changes = {col: [] for col in range(1, num_cols + 1)}
    row_changes = {row: [] for row in range(0, num_rows + 1)}

    for change in changes:
        if change["type"] != "change_cell":
            continue
        col_changes[change["col"]].append(change)
        row_changes[change["row"]].append(change)

    for col, col_changes in col_changes.items():
        if len(col_changes) == num_rows + 1 and all(
            change["row"] == i
            for i, change in enumerate(
                sorted(col_changes, key=lambda x: x["row"]), start=0
            )
        ):
            old_values = [
                change["old_value"]
                for change in sorted(col_changes, key=lambda x: x["row"])
            ]
            new_values = [
                change["new_value"]
                for change in sorted(col_changes, key=lambda x: x["row"])
            ]
            batch_op = {
                "type": "change_entire_column",
                "col": col,
                "old_values": old_values,
                "new_values": new_values,
            }
            # Replace all change_cell operations for this column with batch_op
            for i, change in enumerate(changes_copy):
                if change in col_changes:
                    changes_copy[i] = batch_op
            batch_operations.append(batch_op)

    for row, row_changes in row_changes.items():
        if len(row_changes) == num_cols and all(
            change["col"] == i
            for i, change in enumerate(
                sorted(row_changes, key=lambda x: x["col"]), start=1
            )
        ):
            old_values = [
                change["old_value"]
                for change in sorted(row_changes, key=lambda x: x["col"])
            ]
            new_values = [
                change["new_value"]
                for change in sorted(row_changes, key=lambda x: x["col"])
            ]
            batch_op = {
                "type": "change_entire_row",
                "row": row,
                "old_values": old_values,
                "new_values": new_values,
            }
            # Replace all change_cell operations for this row with batch_op
            for i, change in enumerate(changes_copy):
                if change in row_changes:
                    changes_copy[i] = batch_op
            batch_operations.append(batch_op)

    # Deduplicate changes_copy list to avoid repeated batch operations
    unique_changes = []
    seen_operations = set()
    for change in changes_copy:
        # Convert any list values in the change dict to tuples for hashing
        change_tuple = tuple(
            (k, tuple(v) if isinstance(v, list) else v) for k, v in change.items()
        )
        if change_tuple not in seen_operations:
            unique_changes.append(change)
            seen_operations.add(change_tuple)

    log_text(client_id, f"Batch Operations:\n{json.dumps(batch_operations, indent=4)}")
    return unique_changes


def mata_diff_to_NL(
    client_id: str,
    diff: str,
    row_count: int,
    column_names: list,
    sheet_state_string: str,
) -> str:
    changes = extract_changes(client_id, diff)
    changes = find_batch_operation(client_id, changes, row_count, len(column_names))

    for change in changes:
        for key in change:
            if "col" in key:
                change[key] = column_names[change[key] - 1]

    changes_text = ""
    for change in changes:
        changes_text += json.dumps(change) + "\n"
    transfer_user_prompt = transfer_user_template.replace(
        "{USER_OPERATIONS}", changes_text
    ).replace("{INFORMATION}", sheet_state_string)

    messages = append_message(transfer_system_prompt, "system", [])
    messages = append_message(transfer_user_prompt, "user", messages)
    response = generate_chat_completion(messages)
    messages = append_message(response, "assistant", messages)
    log_messages(client_id, "mata_diff_to_NL", messages)
    return response


def get_multi_analyze(client_id, table_list, user_prompt):
    input_user_prompt = ""
    sheet_state_list = []
    table_diff_list = []
    for index, table in enumerate(table_list, start=1):
        column_names = table["column_names"]
        column_number = len(column_names)
        sheet_id = table["sheet_id"]
        version = table["version"]

        # remove .csv
        if ".csv" in sheet_id:
            base_name = sheet_id[:-4]

        file_name = f"{base_name}_v{version}.csv"
        row_count = len(table["row_names"])

        column_names = json.dumps(column_names)

        sheet_state_string = (
            sheet_state_template.replace("{index}", str(index))
            .replace("{file_name}", file_name)
            .replace("{column_count}", str(column_number))
            .replace("{column_names}", column_names)
            .replace("{row_count}", str(row_count + 1))
            .replace("{row_end}", str(row_count))
        )
        sheet_state_list.append(sheet_state_string)
        input_user_prompt += sheet_state_string
        if "NL_diff" in table:
            table_diff = table_diff_template.replace("{NL_diff}", table["NL_diff"])
            table_diff_list.append(table_diff)
            input_user_prompt += table_diff

    if user_prompt == "":
        chat_history = []
        user_prompt = "User Instruction: (No user instruction)"
    else:
        chat_history = [
            {
                "role": "user",
                "message": user_prompt,
            }
        ]
        user_prompt = "User Instruction: " + user_prompt
    input_user_prompt += "\n" + user_prompt

    history = {}
    last_history = get_history(client_id)
    if "chat_history" in last_history:
        last_history["chat_history"].extend(chat_history)
        chat_history = last_history["chat_history"]
        input_user_prompt += get_history_text(last_history, with_sheet_info=False)

    history = {
        "information": {
            "sheet_state": sheet_state_list,
            "table_diff": table_diff_list,
            "user_prompt": user_prompt,
        },
        "chat_history": chat_history,
    }
    update_history(client_id, history)

    if config["mode"] == "without_CQ":
        messages = append_message(init_system_prompt_without_CQ, "system", [])
        messages = append_message(input_user_prompt, "user", messages)
        response = generate_chat_completion(messages, special_type="json_object")
        messages = append_message(response, "assistant", messages)
    else:
        messages = append_message(init_system_prompt, "system", [])
        messages = append_message(input_user_prompt, "user", messages)
        response = generate_chat_completion(messages, special_type="json_object")
        messages = append_message(response, "assistant", messages)

    if response["type"] == "question":
        history = get_history(client_id)
        if "choices" not in response:
            response["choices"] = ["other (please specify)"]
        history["chat_history"].append(
            {
                "role": "assistant",
                "message": format_multiple_choices_question(
                    response["question"], response["choices"]
                ),
            }
        )
        update_history(client_id, history)
    else:
        history = get_history(client_id)
        history["summary"] = response["summary"]
        update_history(client_id, history)
    log_messages(client_id, "analyze_init", messages)
    return response


def multi_analyze(
    client_id: str,
    table_list: List[dict],
    user_promt: str,
) -> str:
    for index, table in enumerate(table_list, start=1):
        sheet_id = table["sheet_id"]
        version = table["version"]
        file_name = f"{sheet_id.split('.csv')[0]}_v{version}.csv"
        row_count = len(table["row_names"])
        column_names = table["column_names"]
        column_count = len(column_names)
        table_diff = table["table_diff"]

        sheet_state_string = (
            sheet_state_template.replace("{index}", str(index))
            .replace("{file_name}", file_name)
            .replace("{column_count}", str(column_count))
            .replace("{column_names}", json.dumps(column_names))
            .replace("{row_count}", str(row_count + 1))
            .replace("{row_end}", str(row_count))
        )
        if table_diff:
            NL_diff = mata_diff_to_NL(
                client_id,
                table_diff,
                row_count,
                column_names,
                sheet_state_string,
            )
            table["NL_diff"] = NL_diff
    response = get_multi_analyze(client_id, table_list, user_promt)
    return response


def followup(client_id, response):
    history = get_history(client_id)
    history["chat_history"].append(
        {
            "role": "user",
            "message": response,
        }
    )
    update_history(client_id, history)

    history = get_history(client_id)
    history_text = get_history_text(history)
    messages = append_message(followup_system_prompt, "system", [])
    messages = append_message(history_text, "user", messages)
    response = generate_chat_completion(messages, special_type="json_object")
    message = append_message(response, "assistant", messages)
    log_messages(client_id, "followup", message)

    if response["type"] == "question":
        history = get_history(client_id)
        if "choices" not in response:
            response["choices"] = ["other (please specify)"]
        history["chat_history"].append(
            {
                "role": "assistant",
                "message": format_multiple_choices_question(
                    response["question"], response["choices"]
                ),
            }
        )
        update_history(client_id, history)
    else:
        history = get_history(client_id)
        history["summary"] = response["summary"]
        update_history(client_id, history)
    return response
