import json
from dsl import function_map


def init_prompt():
    global question_template, answer_template
    global selected_dsl_grammar_template
    global error_message_template
    with open("prompt/template/question.txt") as f:
        question_template = f.read()
    with open("prompt/template/answer.txt") as f:
        answer_template = f.read()
    with open("prompt/synthesize/dsl_grammar_selected.txt", "r") as f:
        selected_dsl_grammar_template = f.read()
    with open("prompt/synthesize/error_message_template.txt", "r") as f:
        error_message_template = f.read()


init_prompt()


def format_multiple_choices_question(question, choices):
    choices_string = ""
    for index, choice in enumerate(choices, start=1):
        choices_string += f"{index}. {choice}\n"
    prompt = question_template.replace("{QUESTION}", question).replace(
        "{CHOICES}", choices_string
    )
    return prompt.strip()


def get_history_text(history, with_sheet_info=True):
    if with_sheet_info:
        prompt = format_information(history["information"])
    else:
        prompt = ""
    chat_history = history["chat_history"]
    prompt += "\nChat History:\n"
    for chat in chat_history:
        prompt += f"{chat['role'].upper()}:\n{chat['message']}\n\n"

    return prompt


def format_information(information, with_table_diff=True):
    result = ""
    for index, item in enumerate(information["sheet_state"]):
        result += item
        if (
            with_table_diff
            and "table_diff" in information
            and index < len(information["table_diff"])
        ):
            result += "\n"
            result += information["table_diff"][index]
    result += "\n"
    result += information["user_prompt"]
    result += "\n"
    return result


def format_error_message(error_list):
    error_message = "ERROR_LIST:\n"
    for index, error in enumerate(error_list, start=1):
        if "function_name" in error:
            error_message += (
                error_message_template.replace("{INDEX}", str(index))
                .replace("{ERROR_TYPE}", error["error_type"])
                .replace("{FUNCTION_NAME}", error["function_name"])
                .replace("{MESSAGE}", error["error_message"])
            )
        else:
            error_message += (
                error_message_template.replace("{INDEX}", str(index))
                .replace("{ERROR_TYPE}", error["error_type"])
                .replace("{MESSAGE}", error["error_message"])
            )
    return error_message


def format_selected_dsl_grammar(function_list):
    table_level_functions = set()
    column_row_level_functions = set()
    string_operation_functions = set()
    summarization_functions = set()

    for function_name in function_list:
        if function_name in function_map:
            function_class = function_map[function_name]()
            function_type = function_class.function_type
            function_definition = function_class.definition()

            if function_type == "table":
                table_level_functions.add(function_definition)
            elif function_type == "column_row":
                column_row_level_functions.add(function_definition)
            elif function_type == "summarization":
                summarization_functions.add(function_definition)
            elif function_type == "string_operation":
                string_operation_functions.add(function_definition)

    def format_definition_set(definition_set, prefix):
        if len(definition_set) == 0:
            return ""
        text = prefix
        for index, definition in enumerate(definition_set, start=1):
            text += f"{index}. {definition}\n\n"
        return text

    table_level_text = format_definition_set(
        table_level_functions, "### Table-level Functions\n\n"
    )
    column_row_level_text = format_definition_set(
        column_row_level_functions, "### Column/Row-level Functions\n\n"
    )
    summarization_text = format_definition_set(
        summarization_functions, "### Summarization Functions\n\n"
    )
    string_operation_functions = format_definition_set(
        string_operation_functions, "### String Operation Functions\n\n"
    )

    return (
        selected_dsl_grammar_template.replace(
            "{TABLE-LEVEL FUNCTIONS}", table_level_text
        )
        .replace("{CLOUMN/ROW-LEVEL FUNCTIONS}", column_row_level_text)
        .replace("{SUMMARIZATION FUNCTIONS}", summarization_text)
        .replace("{STRING OPERATION FUNCTIONS}", string_operation_functions)
        .strip()
    )
