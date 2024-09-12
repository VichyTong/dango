import json


def transfer_to_NL(dsl):
    if dsl["function_name"] == "blank_table":
        row_number = dsl["arguments"][0]
        column_number = dsl["arguments"][1]
        return f"Create a blank table with {row_number} rows and {column_number} columns"
    elif dsl["function_name"] == "delete_table":
        table = dsl["arguments"][0]
        return f"Delete the table {table}"
    elif dsl["function_name"] == "insert":
        index = dsl["arguments"][1]
        axis = dsl["arguments"][3]
        if axis == 0 or axis == "index" or axis == "0":
            return f"Insert a row at position {index} in the given table(s)"
        elif axis == 1 or axis == "columns" or axis == "1":
            return f"Insert a column at position {index} in the given table(s)"
        else:
            return "Invalid function"
    elif dsl["function_name"] == "drop":
        label = dsl["arguments"][1]
        axis = dsl["arguments"][2]
        if axis == 0 or axis == "index" or axis == "0":
            return f"Drop the row {label} in the given table(s)"
        elif axis == 1 or axis == "columns" or axis == "1":
            return f"Drop the column {label} in the given table(s)"
        else:
            return "Invalid function"
    elif dsl["function_name"] == "assign":
        values = dsl["arguments"][5]
        string_values = json.dumps(values)
        return f"Assign the values {string_values} in the given table(s)"
    elif dsl["function_name"] == "move":
        origin_index = dsl["arguments"][1]
        target_index = dsl["arguments"][3]
        axis = dsl["arguments"][4]
        if axis == 0 or axis == "index" or axis == "0":
            return f"Move the row {origin_index} to row {target_index} in the given table(s)"
        elif axis == 1 or axis == "columns" or axis == "1":
            return f"Move the column {origin_index} to column {target_index} in the given table(s)"
        else:
            return "Invalid function"
    elif dsl["function_name"] == "copy":
        origin_label = dsl["arguments"][1]
        target_label = dsl["arguments"][3]
        axis = dsl["arguments"][4]
        if axis == 0 or axis == "index" or axis == "0":
            return f"Copy the row {origin_label} to row {target_label} in the given table(s)"
        elif axis == 1 or axis == "columns" or axis == "1":
            return f"Copy the column {origin_label} to column {target_label} in the given table(s)"
        else:
            return "Invalid function"
    elif dsl["function_name"] == "swap":
        label_a = dsl["arguments"][1]
        label_b = dsl["arguments"][3]
        axis = dsl["arguments"][4]
        if axis == 0 or axis == "index" or axis == "0":
            return f"Swap the row {label_a} and the row {label_b} in the given table(s)"
        elif axis == 1 or axis == "columns" or axis == "1":
            return f"Swap the column {label_a} and the column {label_b} in the given table(s)"
        else:
            return "Invalid function"
    elif dsl["function_name"] == "merge":
        table_b = dsl["arguments"][1]
        on = dsl["arguments"][3]
        if on is not None:
            return f"Merge the given table(s) with the table {table_b} based on the values in the column {on}"
        else:
            return "Invalid function"
    elif dsl["function_name"] == "concatenate":
        label_a = dsl["arguments"][1]
        label_b = dsl["arguments"][2]
        glue = dsl["arguments"][3]
        axis = dsl["arguments"][5]
        if axis == 0 or axis == "index" or axis == "0":
            return f"Concatenate the rows {label_a} and {label_b} in the given table(s) with the glue {glue}"
        elif axis == 1 or axis == "columns" or axis == "1":
            return f"Concatenate the columns {label_a} and {label_b} in the given table(s) with the glue {glue}"
        else:
            return "Invalid function"
    elif dsl["function_name"] == "split":
        label = dsl["arguments"][1]
        delimiter = dsl["arguments"][2]
        axis = dsl["arguments"][4]
        if axis == 0 or axis == "index" or axis == "0":
            return f"Split the values in the row {label} in the given table(s) with the delimiter '{delimiter}'"
        elif axis == 1 or axis == "columns" or axis == "1":
            return f"Split the values in the column {label} in the given table(s) with the delimiter '{delimiter}'"
        else:
            return "Invalid function"
    elif dsl["function_name"] == "transpose":
        return f"Transpose the given table(s)"
    elif dsl["function_name"] == "aggregate":
        functions = dsl["arguments"][1]
        axis = dsl["arguments"][2]
        return f"Aggregate the given table(s) with the functions {functions}"
    elif dsl["function_name"] == "test":
        table_a = dsl["arguments"][0]
        label_a = dsl["arguments"][1]
        table_b = dsl["arguments"][2]
        label_b = dsl["arguments"][3]
        strategy = dsl["arguments"][4]
        axis = dsl["arguments"][5]
        if axis == 0 or axis == "index" or axis == "0":
            return f"Test the rows {label_a} in table {table_a} and {label_b} in table {table_b} using the {strategy}."
        elif axis == 1 or axis == "columns" or axis == "1":
            return f"Test the columns {label_a} in table {table_a} and {label_b} in table {table_b} using the {strategy}."
        else:
            return "Invalid function"
    elif dsl["function_name"] == "rearrange":
        by_values = dsl["arguments"][1]
        axis = dsl["arguments"][2]
        if axis == 0 or axis == "index" or axis == "0":
            return f"Rearrange the rows in the given table(s) based on the values in the row {by_values}"
        elif axis == 1 or axis == "columns" or axis == "1":
            return f"Rearrange the columns in the given table(s) based on the values in the column {by_values}"
        else:
            return "Invalid function"
    elif dsl["function_name"] == "format":
        label = dsl["arguments"][1]
        pattern = dsl["arguments"][2]
        replace_with = dsl["arguments"][3]
        axis = dsl["arguments"][4]
        if axis == 0 or axis == "index" or axis == "0":
            return f"Format the values in the row {label} in the given table(s) with the pattern {pattern} and replace them with {replace_with}"
        elif axis == 1 or axis == "columns" or axis == "1":
            return f"Format the values in the column {label} in the given table(s) with the pattern {pattern} and replace them with {replace_with}"
        else:
            return "Invalid function"
    elif dsl["function_name"] == "divide":
        by = dsl["arguments"][1]
        axis = dsl["arguments"][2]
        if axis == 0 or axis == "index" or axis == "0":
            return f"Divide the given table(s) by the values in the row {by}"
        elif axis == 1 or axis == "columns" or axis == "1":
            return f"Divide the given table(s) by the values in the column {by}"
        else:
            return "Invalid function"
    elif dsl["function_name"] == "fill":
        labels = dsl["arguments"][1]
        method = dsl["arguments"][2]
        if labels == "ALL":
            return f"Fill all missing values in the given table(s) with the method {method}"
        return f"Fill the missing values in the column {labels} in the given table(s) with the method {method}"
    elif dsl["function_name"] == "pivot_table":
        index = dsl["arguments"][1]
        columns = dsl["arguments"][2]
        values = dsl["arguments"][3]
        aggfunc = dsl["arguments"][4]
        return f"Create a pivot table in the given table(s) with the index {index}, columns {columns}, values {values}, and the aggregation function {aggfunc}"
    elif dsl["function_name"] == "subtable":
        label_list = dsl["arguments"][1]
        axis = dsl["arguments"][2]
        if axis == 0 or axis == "index" or axis == "0":
            return f"Extract a subtable from the given table(s) based on the rows {label_list}"
        elif axis == 1 or axis == "columns" or axis == "1":
            return f"Extract a subtable from the given table(s) based on the columns {label_list}"
        else:
            return "Invalid function"
    elif dsl["function_name"] == "count":
        label = dsl["arguments"][1]
        value = dsl["arguments"][2]
        axis = dsl["arguments"][3]
        if axis == 0 or axis == "index" or axis == "0":
            return f"Count the occurrences of the value {value} in the row {label} in the given table(s)"
        elif axis == 1 or axis == "columns" or axis == "1":
            return f"Count the occurrences of the value {value} in the column {label} in the given table(s)"
        else:
            return "Invalid function"
    else:
        return "Invalid function"
    