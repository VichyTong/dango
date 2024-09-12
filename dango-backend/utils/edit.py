import json

from utils.llm import (
    append_message,
    generate_chat_completion,
)
from utils.convert2NL import transfer_to_NL
from utils.db import get_DSL_functions, update_DSL_functions
from utils.log import log_messages


def init_prompt():
    global dsl_grammar
    global edit_dsl_system_prompt, edit_dsl_user_template
    global update_dsl_system_prompt, update_dsl_user_template
    global update_user_intent_system_prompt, update_user_intent_user_template
    with open("prompt/synthesize/dsl_grammar.txt", "r") as f:
        dsl_grammar = f.read()
    with open("prompt/edit/edit_dsl_system.txt", "r") as f:
        edit_dsl_system_prompt = f.read().replace("{DSL_GRAMMAR}", dsl_grammar)
    with open("prompt/edit/edit_dsl_user.txt", "r") as f:
        edit_dsl_user_template = f.read()
    with open("prompt/edit/update_dsl_system.txt", "r") as f:
        update_dsl_system_prompt = f.read().replace("{DSL_GRAMMAR}", dsl_grammar)
    with open("prompt/edit/update_dsl_user.txt", "r") as f:
        update_dsl_user_template = f.read()
    with open("prompt/edit/update_user_intent_system.txt", "r") as f:
        update_user_intent_system_prompt = f.read()
    with open("prompt/edit/update_user_intent_user.txt", "r") as f:
        update_user_intent_user_template = f.read()


init_prompt()


def update_intent(client_id, dsl_functions, old_intent):
    messages = append_message(update_user_intent_system_prompt, "system", [])
    messages = append_message(
        update_user_intent_user_template.replace(
            "{DSL_SCRIPT}", json.dumps(dsl_functions, indent=4)
        ).replace("{USER_INTENT}", old_intent),
        "user",
        messages,
    )
    response = generate_chat_completion(messages)
    messages = append_message(response, "assistant", messages)
    log_messages(client_id, "update_intent", messages)
    return response


def edit_dsl(client_id, dsl, new_instruction):
    function = dsl.function_name
    arguments = dsl.arguments
    try:
        condition = dsl.condition
        dsl = {
            "function": function,
            "arguments": arguments,
            "condition": condition,
        }
    except AttributeError:
        dsl = {
            "function": function,
            "arguments": arguments,
        }

    edit_dsl_user_prompt = edit_dsl_user_template.replace(
        "{DSL}", json.dumps(dsl, indent=4)
    ).replace("{INSTRUCTIONS}", new_instruction)
    messages = append_message(edit_dsl_system_prompt, "system", [])
    messages = append_message(edit_dsl_user_prompt, "user", messages)
    edited_dsl = generate_chat_completion(messages, special_type="json_object")
    messages = append_message(edited_dsl, "assistant", messages)
    log_messages(client_id, "edit_dsl", messages)

    # Apply transfer_to_NL and add natural_language field
    edited_dsl["natural_language"] = transfer_to_NL(edited_dsl)

    dsl_functions = get_DSL_functions(client_id)
    for i, d in enumerate(dsl_functions["program"]):
        if d["function_name"] == function and d["arguments"] == arguments:
            dsl_functions["program"][i] = edited_dsl
            break

    dsl_functions["step_by_step_plan"] = update_intent(
        client_id, dsl_functions["program"], dsl_functions["step_by_step_plan"]
    )
    update_DSL_functions(client_id, dsl_functions)
    return edited_dsl


def update_dsl(client_id, new_instruction):
    dsl_functions = get_DSL_functions(client_id)

    update_dsl_user_prompt = update_dsl_user_template.replace(
        "{DSL_LIST}", json.dumps(dsl_functions["program"], indent=4)
    ).replace("{INSTRUCTIONS}", new_instruction)
    messages = append_message(update_dsl_system_prompt, "system", [])
    messages = append_message(update_dsl_user_prompt, "user", messages)
    created_dsl = generate_chat_completion(messages, special_type="json_object")
    messages = append_message(created_dsl, "assistant", messages)
    log_messages(client_id, "update_dsl", messages)

    # Apply transfer_to_NL and add natural_language field
    created_dsl["natural_language"] = transfer_to_NL(created_dsl)

    dsl_functions["program"].append(created_dsl)

    dsl_functions["step_by_step_plan"] = update_intent(
        client_id, dsl_functions["program"], dsl_functions["step_by_step_plan"]
    )
    update_DSL_functions(client_id, dsl_functions)
    return created_dsl
