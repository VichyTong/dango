from pydantic import BaseModel, ValidationError
from typing import List, Union, Optional


class FunctionCall(BaseModel):
    function_name: str
    arguments: List


def create_error_message(error, error_message, function_name=None):

    if function_name:
        return {
            "error_type": error,
            "function_name": function_name,
            "error_message": error_message
        }
    else:
        return {
            "error_type": error,
            "error_message": error_message
        }


def validate_dsls_format(function_calls: List[dict], error_list=[]):
    try:
        validated_calls = [FunctionCall(**call) for call in function_calls]
        return validated_calls
    except ValidationError as e:
        error = create_error_message("DSLs format is invalid", "The format should be a list of dictionaries with keys 'function_name' and 'arguments' where 'arguments' is a list.")
        error_list.append(error)
        return "Failed"


# blank_table(row_number, column_number): Returns an empty table with the specified number of rows and columns.
# Parameters:
# - row_number (int, required): The number of rows in the table.
# - column_number (int, required): The number of columns in the table.
# Output:
# - A pandas DataFrame.

class BLANK_TABLE_PARAMS(BaseModel):
    row_number: int
    column_number: int

def blank_table(params: BLANK_TABLE_PARAMS):
    return

# delete_table(table_name): Deletes the specified table.
# Parameters:
# - table_name (str): The name of the table to be deleted.

class DELETE_TABLE_PARAMS(BaseModel):
    table_name: str


def delete_table(params: DELETE_TABLE_PARAMS):
    return

# insert(table, index, index_name, axis): Inserts an empty row or column at the specified index in the table. Other rows or columns will be moved down or to the right.
# Parameters:
# - table (DataFrame, required): The table to insert the row or column into.
# - index (int, required): The position at which the new row or column will be inserted. For example, if index is 1, the new row or column will be at position 1.
# - index_name (str, required): The name of the new row or column.
# - axis (str or int, required):
#     - 0 or "index": Indicates that a row will be inserted.
#     - 1 or "columns": Indicates that a column will be inserted.


class INSERT_PARAMS(BaseModel):
    table_name: str
    index: int
    index_name: str
    axis: Union[str, int]


def insert(params: INSERT_PARAMS):
    return

# drop(table, label, axis): Drops one or more rows or columns from the table.
# Parameters:
# - table (DataFrame, required): The table from which the row(s) or column(s) will be dropped.
# - label (str or int or list[str] or list[int], required): The label or list of labels of the row(s) or column(s) to be dropped.
# - axis (str or int, required):
#     - 0 or "index": Indicates that one or more rows will be dropped.
#     - 1 or "columns": Indicates that one or more columns will be dropped.


class DROP_PARAMS(BaseModel):
    table_name: str
    label: Union[str, int, List[str], List[int]]
    axis: Union[str, int]


def drop(params: DROP_PARAMS):
    return

# assign(table, start_row_index, end_row_index, start_column_index, end_column_index, values): Assigns fixed constant values to specific cells in the table.
# Parameters:
# - table (DataFrame, required): The table to which the values will be assigned.
# - start_row_index, end_row_index (int, required): The range of row indices where the values will be assigned. Indexing starts from 0 and must be int.
# - start_column_index, end_column_index (int, required): The range of column indices where the values will be assigned. Indexing starts from 0 and must be int.
# - values (list[list[int/float/str]] or int/float/str, required): The constant value(s) to assign to the specified cell(s). If "values" is a list of list, the values are assigned in order from top to bottom, left to right. If "values" is a single value, it is assigned to all cells in the specified range.

class ASSIGN_PARAMS(BaseModel):
    table_name: str
    start_row_index: int
    end_row_index: int
    start_column_index: int
    end_column_index: int
    values: Union[List[List[Union[int, str, float]]], int, float, str]


def assign(params: ASSIGN_PARAMS):
    return

# move(origin_table, origin_index, target_table, target_index, axis): Moves a row or column from the origin table to the target table.
# Parameters:
# - origin_table (DataFrame, required): TThe table from which the row or column will be moved.
# - origin_index (int, required): The index of the row or column to be moved in the origin table.
# - target_table (DataFrame, required): The table to which the row or column will be moved.
# - target_index (int, required): The index at which the row or column will be inserted in the target table.
# - axis (str or int, required):
#     - 0 or "index": Indicates that a row will be moved.
#     - 1 or "columns": Indicates that a column will be moved.


class MOVE_PARAMS(BaseModel):
    origin_table_name: str
    origin_index: Union[int, str]
    target_table_name: str
    target_index: Union[int, str]
    axis: Union[str, int]


def move(params: MOVE_PARAMS):
    return

# copy(origin_table, origin_label, target_table, target_label, axis): Copies a row or column from the origin table to the target table at the specified label.
# Parameters:
# - origin_table (DataFrame, required): The table from which the row or column will be copied.
# - origin_label (str or int, required): The label of the row or column to be copied.
# - target_table (DataFrame, required): The table to which the row or column will be copied.
# - target_label (str or int, required): The label at which the row or column will be placed in the target table. If this label already exists, the copied row or column will overwrite the existing one.
# - axis (str or int, required): Specifies the axis along which the copy operation is performed.
#     - 0 or "index": Copy a row.
#     - 1 or "columns": Copy a column.


class COPY_PARAMS(BaseModel):
    origin_table_name: str
    origin_label: Union[str, int]
    target_table_name: str
    target_label: Union[str, int]
    axis: Union[str, int]


def copy(params: COPY_PARAMS):
    return

# swap(table_a, label_a, table_b, label_b, axis): Swaps rows or columns between two tables.
# Parameters:
# - table_a (DataFrame, required): The first table from which the row or column will be swapped.
# - label_a (str or int, required): The label of the row or column to be swapped in the first table.
# - table_b (DataFrame, required): The second table from which the row or column will be swapped.
# - label_b (str or int, required): The label of the row or column to be swapped in the second table.
# - axis (str or int, required):
#     - 0 or "index": Indicates to swap rows.
#     - 1 or "columns": Indicates to swap columns.


class SWAP_PARAMS(BaseModel):
    table_name_a: str
    label_a: Union[str, int]
    table_name_b: str
    label_b: Union[str, int]
    axis: Union[str, int]


def swap(params: SWAP_PARAMS):
    return

# merge(table_a, table_b, how, on): Merges two tables based on a common column.
# Parameters:
# - table_a (DataFrame, required): The first table to merge.
# - table_b (DataFrame, required): The second table to merge.
# - how(str, required): The type of merge to be performed. Options are 'left', 'right', 'outer', 'inner', or 'fuzzy'.
# - on(str, required): Column or index level names to join on. Must be present in both tables.

class MERGE_PARAMS(BaseModel):
    table_name_a: str
    table_name_b: str
    how: str
    on: Optional[str]


def merge(params: MERGE_PARAMS):
    return

# concatenate(table, label_a, label_b, glue, new_label, axis): Concatenates two rows or columns using a string as glue and appends the merged row or column to the table.
# Parameters:
# - table (DataFrame, required): The table in which the rows or columns will be concatenated.
# - label_a (str or int, required): The label of the first row or column to be concatenated.
# - label_b (str or int, required): The label of the second row or column to be concatenated.
# - glue (str, required): The string used to concatenate the two rows or columns.
# - new_label (str or int, required): The label of the new row or column created by the concatenation.
# - axis (str or int, required):
#     - 0 or "index": Indicates that rows will be concatenated.
#     - 1 or "columns": Indicates that columns will be concatenated.


class CONCATENATE_PARAMS(BaseModel):
    table_name: str
    label_a: Union[str, int]
    label_b: Union[str, int]
    glue: str
    new_label: Union[str, int]
    axis: Union[str, int]


def concatenate(params: CONCATENATE_PARAMS):
    return

# split(table, label, delimiter, new_label_list, axis): Separates rows or columns based on a string delimiter within the values.
# Parameters:
# - table (DataFrame, required): The table in which the rows or columns will be split.
# - label (str or int, required): The label of the row or column to be split.
# - delimiter (str, required): The delimiter to use for splitting the rows or columns.
# - new_label_list (list[str or int], required): The list of labels for the new rows or columns created by the split.
# - axis (str or int, required):
#     - 0 or 'index': Indicates row splitting.
#     - 1 or 'columns': Indicates column splitting.

class SPLIT_PARAMS(BaseModel):
    table_name: str
    label: Union[str, int]
    delimiter: str
    new_label_list: List[Union[str, int]]
    axis: Union[str, int]

def split(params: SPLIT_PARAMS):
    return

# transpose(table): Transposes the given table.
# Parameters:
# - table (DataFrame, required): The table to be transposed.


class TRANSPOSE_PARAMS(BaseModel):
    table_name: str


def transpose(params: TRANSPOSE_PARAMS):
    return


# aggregate(table, functions, axis): Aggregates the table using a specified function.
# Parameters:
# - table (DataFrame, required): table to be aggregated.
# - functions (dict, required): Keys are the names of rows or columns, and values are lists of function names. Example: {'A': ['sum', 'mean'], 'B': ['min', 'max']}.
# - axis (str or int, required):
#     - 0 or "index": Applies the aggregate operations on rows, with the keys in the functions dictionary corresponding to row names.
#     - 1 or "columns": Applies the aggregate operations on columns, with the keys in the functions dictionary corresponding to column names.

class AGGREGATE_PARAMS(BaseModel):
    table_name: str
    functions: dict
    axis: Union[str, int]


def aggregate(params: AGGREGATE_PARAMS):
    return

# test(table_a, label_a, table_b, label_b, strategy, axis): Compares two labels using the specified statistical test and returns a tuple (statistic, p_value).
# Parameters:
# - table_a (DataFrame, required): The first table on which the test will be performed.
# - label_a (str or int, required): The label of the first row or column to be tested in the first table.
# - table_b (DataFrame, required): The second table on which the test will be performed.
# - label_b (str or int, required): The label of the second row or column to be tested in the second table.
# - strategy (str, required): The statistical test to perform. Options include 't-test', 'z-test', 'chi-squared', 'pearson-correlation'.
# - axis (str or int, required):
#     - 0 or "index": Indicates that rows will be tested.
#     - 1 or "columns": Indicates that columns will be tested.

class TEST_PARAMS(BaseModel):
    table_name_a: str
    label_a: Union[str, int]
    table_name_b: str
    label_b: Union[str, int]
    strategy: str
    axis: Union[str, int]


def test(params: TEST_PARAMS):
    return


# format(table, label, pattern, replace_with, axis): Formats the values in a row or column based on the specified pattern and "replace_with" using re.sub().
# Parameters:
# - table (DataFrame, required): The DataFrame in which the row or column will be formatted.
# - label (str or int, required): The label of the row or column to be formatted.
# - pattern (str, required): The regex pattern to apply to the values. You can use group syntax.
# - replace_with (str, required): The string or backreference to replace the matched pattern with.
# - axis (str or int, required):
#     - 0 or "index": Indicates to format a row.
#     - 1 or "columns": Indicates to format a column.

class FORMAT_PARAMS(BaseModel):
    table_name: str
    label: Union[str, int]
    pattern: str
    replace_with: str
    axis: Union[str, int]

def format(params: FORMAT_PARAMS):
    return

# rearrange(table, by_values, axis): Rearranges the rows or columns of the table based on the specified order.
# Parameters:
# - table (DataFrame, required): The table to be rearranged.
# - by_values (str, required): If set, the rows or columns will be rearranged based on the values in the specified row or column.
# - axis (str or int, required):
#     - 0 or "index": Indicates that rows will be rearranged based on the values in the specified row or column.
#     - 1 or "columns": Indicates that columns will be rearranged based on the values in the specified row or column.
# Output:
# - A pandas DataFrame.

class REARRANGE_PARAMS(BaseModel):
    table_name: str
    by_values: str
    axis: Union[str, int]

def rearrange(params: REARRANGE_PARAMS):
    pass

# divide(table, by, axis): Divides the table by the specified row or column, returning a list of tables.
# Parameters:
# - table (DataFrame, required): The table to be divided.
# - by(int/str, required): The label of the row or column by which the table will be divided.
# - axis (str or int, required):
#     - 0 or "index": Indicates that the table will be divided by a row. Set axis to 0 if by is a row label.
#     - 1 or "columns": Indicates that the table will be divided by a column. Set axis to 1 if by is a column label.

class DIVIDE_PARAMS(BaseModel):
    table_name: str
    by: Union[str, int]
    axis: Union[str, int]

def divide(params: DIVIDE_PARAMS):
    pass

# pivot_table(table, index, columns, values, aggfunc): Reshapes the table so that each unique value in columns becomes a separate column, with index values as row headers, and the corresponding values filled in their respective cells.
# Parameters:
# - table (DataFrame, required): The table to pivot.
# - index (str, required): The column name to use as the new row headers.
# - columns (str, required): The column name to use as the new column headers.
# - values (str, required): The column name whose values will fill the new table.
# - aggfunc (str, required): The aggregation function to apply to the values. Common options are 'first', 'sum', 'mean', etc.

class PIVOT_TABLE_PARAMS(BaseModel):
    table_name: str
    index: str
    columns: str
    values: str
    aggfunc: str

def pivot_table(params: PIVOT_TABLE_PARAMS):
    pass

# fill(table, method, labels): Fills missing values in the table using the specified method.
# Parameters:
# - table (DataFrame, required): The table in which missing values will be filled.
# - labels (list[str or int] or int or str, required): The label or list of labels where missing values will be filled.
# - method (str, required): The method to use for filling missing values. Choose from 'value', 'mean', 'median', 'mode', 'ffill', 'bfill', 'interpolate'.

class FILL(BaseModel):
    table_name: str
    label: Union[List[str], str]
    method: str

def fill(params: FILL):
    pass

# subtable(table, labels, axis): Extracts a subtable from a DataFrame based on specified rows or columns.
# Parameters:
# - table (DataFrame, required): The table from which rows or columns will be extracted.
# - labels (list[int/str], required): A list of row or column labels to be extracted.
# - axis (str or int, required):
#     - 0 or "index": Indicates that the labels are row labels.
#     - 1 or "columns": Indicates that the labels are column labels.


class SUBTABLE(BaseModel):
    table_name: str
    labels: List[Union[int, str]]
    axis: Union[str, int]

def subtable(params: SUBTABLE):
    pass

# count(table, label, value, axis): Counts the occurrences of a specified value within a given column or row in a DataFrame, then store the value in a new DataFrame.
# Parameters:
# - table (DataFrame, required): The DataFrame to operate on.
# - label (str or int, required): The column name (if axis=0) or row label/index (if axis=1) where the value should be counted.
# - value (str or int, required): The value to count within the specified column or row.
# - axis (int or str, optional):
#     - 0 or "index": Indicates that the count will be performed on a column.
#     - 1 or "columns": Indicates that the count will be performed on a row.

class COUNT(BaseModel):
    table_name: str
    label: Union[str, int]
    value: Union[str, int]
    axis: Union[str, int]

def count(params: COUNT):
    pass


def get_sheet_names(all_sheets):
    sheets_names = [sheet[0] for sheet in all_sheets]
    sheets_names = [sheet.split(".csv")[0] for sheet in sheets_names]
    sheets_versions = [sheet[1] for sheet in all_sheets]
    sheets_names = [f"{sheets_names[i]}_v{sheets_versions[i]}.csv" for i in range(len(sheets_names))]
    return sheets_names


def validate_dsls_functions(function_calls: List[dict], all_sheets, error_list=[]):
    valid_functions = [
        "aggregate",
        "assign",
        "blank_table",
        "concatenate",
        "copy",
        "count",
        "delete_table",
        "divide",
        "drop",
        "fill",
        "format",
        "insert",
        "merge",
        "move",
        "pivot_table",
        "rearrange",
        "split",
        "subtable",
        "swap",
        "test",
        "transpose",
    ]
    sheets_names = get_sheet_names(all_sheets)
    for call in function_calls:
        if call["function_name"] not in valid_functions:
            error = create_error_message("Invalid function name", f"The function name '{call['function_name']}' is not a valid function. Please use one of the following functions: {', '.join(valid_functions)}.", call["function_name"])
            error_list.append(error)
        else:
            if call["function_name"] == "aggregate":
                validate_aggregate(call["arguments"], error_list, sheets_names)
            elif call["function_name"] == "assign":
                validate_assign(call["arguments"], error_list, sheets_names)
            elif call["function_name"] == "blank_table":
                validate_blank_table(call["arguments"], error_list, sheets_names)
            elif call["function_name"] == "concatenate":
                validate_concatenate(call["arguments"], error_list, sheets_names)
            elif call["function_name"] == "copy":
                validate_copy(call["arguments"], error_list, sheets_names)
            elif call["function_name"] == "count":
                validate_count(call["arguments"], error_list, sheets_names)
            elif call["function_name"] == "delete_table":
                validate_delete_table(call["arguments"], error_list, sheets_names)
            elif call["function_name"] == "divide":
                validate_divide(call["arguments"], error_list, sheets_names)
            elif call["function_name"] == "drop":
                validate_drop(call["arguments"], error_list, sheets_names)
            elif call["function_name"] == "fill":
                validate_fill(call["arguments"], error_list, sheets_names)
            elif call["function_name"] == "format":
                validate_format(call["arguments"], error_list, sheets_names)
            elif call["function_name"] == "insert":
                validate_insert(call["arguments"], error_list, sheets_names)
            elif call["function_name"] == "merge":
                validate_merge(call["arguments"], error_list, sheets_names)
            elif call["function_name"] == "move":
                validate_move(call["arguments"], error_list, sheets_names)
            elif call["function_name"] == "pivot_table":
                validate_pivot_table(call["arguments"], error_list, sheets_names)
            elif call["function_name"] == "rearrange":
                validate_rearrange(call["arguments"], error_list, sheets_names)
            elif call["function_name"] == "split":
                validate_split(call["arguments"], error_list, sheets_names)
            elif call["function_name"] == "subtable":
                validate_subtable(call["arguments"], error_list, sheets_names)
            elif call["function_name"] == "swap":
                validate_swap(call["arguments"], error_list, sheets_names)
            elif call["function_name"] == "test":
                validate_test(call["arguments"], error_list, sheets_names)
            elif call["function_name"] == "transpose":
                validate_transpose(call["arguments"], error_list, sheets_names)
    return "Success"

def validate_blank_table(arguments, error_list, sheets_names):
    if len(arguments) != 2:
        error = create_error_message("Invalid number of arguments", f"The function 'blank_table' requires 2 arguments: 'row_number', 'column_number'.", "blank_table")
        error_list.append(error)
        return "Failed"
    try:
        params = BLANK_TABLE_PARAMS(row_number=arguments[0], column_number=arguments[1])
        blank_table(params)
    except ValidationError as e:
        error = create_error_message("Invalid argument format", f"The arguments for 'blank_table' are not in the correct format. Please check the argument types and values.", "blank_table")
        error_list.append(error)
    return "Success"
    

def validate_delete_table(arguments, error_list, sheets_names):
    if len(arguments) != 1:
        error = create_error_message("Invalid number of arguments", f"The function 'delete_table' requires 1 argument: 'table_name'.", "delete_table")
        error_list.append(error)
        return "Failed"
    try:
        params = DELETE_TABLE_PARAMS(table_name=arguments[0])
        delete_table(params)
    except ValidationError as e:
        error = create_error_message("Invalid argument format", f"The argument for 'delete_table' is not in the correct format. Please check the argument type and value.", "delete_table")
        error_list.append(error)
    return "Success"


def validate_insert(arguments, error_list, sheets_names):
    if len(arguments) != 4:
        error = create_error_message("Invalid number of arguments", f"The function 'insert' requires 4 arguments: 'table_name', 'index', 'index_name', 'axis'.", "insert")
        error_list.append(error)
        return "Failed"
    try:
        params = INSERT_PARAMS(table_name=arguments[0], index=arguments[1], index_name=arguments[2], axis=arguments[3])
        insert(params)
    except ValidationError as e:
        error = create_error_message("Invalid argument format", f"The arguments for 'insert' are not in the correct format. Please check the argument types and values.", "insert")
        error_list.append(error)
    return "Success"


def validate_drop(arguments, error_list, sheets_names):
    if len(arguments) != 3:
        error = create_error_message("Invalid number of arguments", f"The function 'drop' requires 3 arguments: 'table_name', 'label', 'axis'.", "drop")
        error_list.append(error)
        return "Failed"
    try:
        params = DROP_PARAMS(table_name=arguments[0], label=arguments[1], axis=arguments[2])
        drop(params)
    except ValidationError as e:
        error = create_error_message("Invalid argument format", f"The arguments for 'drop' are not in the correct format. Please check the argument types and values.", "drop")
        error_list.append(error)
    return "Success"


def validate_assign(arguments, error_list, sheets_names):
    if len(arguments) != 6:
        error = create_error_message("Invalid number of arguments", f"The function 'assign' requires 6 arguments: 'table_name', 'start_row_index', 'end_row_index', 'start_column_index', 'end_column_index', 'values'.", "assign")
        error_list.append(error)
        return "Failed"
    try:
        params = ASSIGN_PARAMS(table_name=arguments[0], start_row_index=arguments[1], end_row_index=arguments[2], start_column_index=arguments[3], end_column_index=arguments[4], values=arguments[5])
        assign(params)
    except ValidationError as e:
        error = create_error_message("Invalid argument format", f"The arguments for 'assign' are not in the correct format. Please check the argument types and values.", "assign")
        error_list.append(error)
    return "Success"


def validate_move(arguments, error_list, sheets_names):
    if len(arguments) != 5:
        error = create_error_message("Invalid number of arguments", f"The function 'move' requires 5 arguments: 'origin_table_name', 'origin_index', 'target_table_name', 'target_index', 'axis'.", "move")
        error_list.append(error)
        return "Failed"
    try:
        params = MOVE_PARAMS(origin_table_name=arguments[0], origin_index=arguments[1], target_table_name=arguments[2], target_index=arguments[3], axis=arguments[4])
        move(params)
    except ValidationError as e:
        error = create_error_message("Invalid argument format", f"The arguments for 'move' are not in the correct format. Please check the argument types and values.", "move")
        error_list.append(error)
    return "Success"


def validate_copy(arguments, error_list, sheets_names):
    if len(arguments) != 5:
        error = create_error_message("Invalid number of arguments", f"The function 'copy' requires 5 arguments: 'origin_table_name', 'origin_label', 'target_table_name', 'target_label', 'axis'.", "copy")
        error_list.append(error)
        return "Failed"
    try:
        params = COPY_PARAMS(origin_table_name=arguments[0], origin_label=arguments[1], target_table_name=arguments[2], target_label=arguments[3], axis=arguments[4])
        copy(params)
    except ValidationError as e:
        error = create_error_message("Invalid argument format", f"The arguments for 'copy' are not in the correct format. Please check the argument types and values.", "copy")
        error_list.append(error)
    return "Success"


def validate_swap(arguments, error_list, sheets_names):
    if len(arguments) != 5:
        error = create_error_message("Invalid number of arguments", f"The function 'swap' requires 5 arguments: 'table_name_a', 'label_a', 'table_name_b', 'label_b', 'axis'.", "swap")
        error_list.append(error)
        return "Failed"
    try:
        params = SWAP_PARAMS(table_name_a=arguments[0], label_a=arguments[1], table_name_b=arguments[2], label_b=arguments[3], axis=arguments[4])
        swap(params)
    except ValidationError as e:
        error = create_error_message("Invalid argument format", f"The arguments for 'swap' are not in the correct format. Please check the argument types and values.", "swap")
        error_list.append(error)
    return "Success"


def validate_merge(arguments, error_list, sheets_names):
    if len(arguments) != 4:
        error = create_error_message("Invalid number of arguments", f"The function 'merge' requires 6 arguments: 'table_name_a', 'table_name_b', 'how', 'on', 'left_on', 'right_on', 'axis'.", "merge")
        error_list.append(error)
        return "Failed"
    try:
        params = MERGE_PARAMS(table_name_a=arguments[0], table_name_b=arguments[1], how=arguments[2], on=arguments[3])
        merge(params)
    except ValidationError as e:
        error = create_error_message("Invalid argument format", f"The arguments for 'merge' are not in the correct format. Please check the argument types and values.", "merge")
        error_list.append(error)
    return "Success"


def validate_concatenate(arguments, error_list, sheets_names):
    if len(arguments) != 6:
        error = create_error_message("Invalid number of arguments", f"The function 'concatenate' requires 6 arguments: 'table_name', 'label_a', 'label_b', 'glue', 'new_label', 'axis'.", "concatenate")
        error_list.append(error)
        return "Failed"
    try:
        params = CONCATENATE_PARAMS(table_name=arguments[0], label_a=arguments[1], label_b=arguments[2], glue=arguments[3], new_label=arguments[4], axis=arguments[5])
        concatenate(params)
    except ValidationError as e:
        error = create_error_message("Invalid argument format", f"The arguments for 'concatenate' are not in the correct format. Please check the argument types and values.", "concatenate")
        error_list.append(error)
    return "Success"


def validate_split(arguments, error_list, sheets_names):
    if len(arguments) != 5:
        error = create_error_message("Invalid number of arguments", f"The function 'split' requires 5 arguments: 'table_name', 'label', 'delimiter', 'new_label_list', 'axis'.", "split")
        error_list.append(error)
        return "Failed"
    
    try:
        params = SPLIT_PARAMS(table_name=arguments[0], label=arguments[1], delimiter=arguments[2], new_label_list=arguments[3], axis=arguments[4])
        split(params)
    except ValidationError as e:
        error = create_error_message("Invalid argument format", f"The arguments for 'split' are not in the correct format. Please check the argument types and values.", "split")
        error_list.append(error)

    return "Success"


def validate_transpose(arguments, error_list, sheets_names):
    if len(arguments) != 1:
        error = create_error_message("Invalid number of arguments", f"The function 'transpose' requires 1 argument: 'table_name'.", "transpose")
        error_list.append(error)
        return "Failed"
    try:
        transpose(arguments[0])
    except ValidationError as e:
        error = create_error_message("Invalid argument format", f"The argument for 'transpose' is not in the correct format. Please check the argument type and value.", "transpose")
        error_list.append(error)
    return "Success"


def validate_aggregate(arguments, error_list, sheets_names):
    if len(arguments) != 3:
        error = create_error_message("Invalid number of arguments", f"The function 'aggregate' requires 3 arguments: 'table_name', 'functions', 'axis'.", "aggregate")
        error_list.append(error)
        return "Failed"
    try:
        params = AGGREGATE_PARAMS(table_name=arguments[0], functions=arguments[1], axis=arguments[2])
        aggregate(params)
    except ValidationError as e:
        error = create_error_message("Invalid argument format", f"The arguments for 'aggregate' are not in the correct format. Please check the argument types and values.", "aggregate")
        error_list.append(error)
    return "Success"


def validate_test(arguments, error_list, sheets_names):
    if len(arguments) != 6:
        error = create_error_message("Invalid number of arguments", f"The function 'test' requires 6 arguments: 'table_name', 'label_a', 'label_b', 'strategy', 'axis'.", "test")
        error_list.append(error)
        return "Failed"
    try:
        params = TEST_PARAMS(table_name_a=arguments[0], label_a=arguments[1], table_name_b=arguments[2], label_b=arguments[3], strategy=arguments[4], axis=arguments[5])
        test(params)
    except ValidationError as e:
        error = create_error_message("Invalid argument format", f"The arguments for 'test' are not in the correct format. Please check the argument types and values.", "test")
        error_list.append(error)
    return "Success"

def validate_format(arguments, error_list, sheets_names):
    if len(arguments) != 5:
        error = create_error_message("Invalid number of arguments", f"The function 'format' requires 4 arguments: 'table_name', 'label', 'pattern', 'axis'.", "format")
        error_list.append(error)
        return "Failed"
    try:
        params = FORMAT_PARAMS(table_name=arguments[0], label=arguments[1], pattern=arguments[2], replace_with=arguments[3], axis=arguments[4])
        format(params)
    except ValidationError as e:
        error = create_error_message("Invalid argument format", f"The arguments for 'format' are not in the correct format. Please check the argument types and values.", "format")
        error_list.append(error)
    return "Success"

def validate_rearrange(arguments, error_list, sheets_names):
    if len(arguments) != 3:
        error = create_error_message("Invalid number of arguments", f"The function 'rearrange' requires 3 arguments: 'table_name', 'by_values', 'axis'.", "rearrange")
        error_list.append(error)
        return "Failed"
    try:
        params = REARRANGE_PARAMS(table_name=arguments[0], by_values=arguments[1], axis=arguments[2])
        rearrange(params)
    except ValidationError as e:
        error = create_error_message("Invalid argument format", f"The arguments for 'rearrange' are not in the correct format. Please check the argument types and values.", "rearrange")
        error_list.append(error)
    return "Success"

def validate_divide(arguments, error_list, sheets_names):
    if len(arguments) != 3:
        error = create_error_message("Invalid number of arguments", f"The function 'divide' requires 3 arguments: 'table_name', 'by', 'axis'.", "divide")
        error_list.append(error)
        return "Failed"
    try:
        params = DIVIDE_PARAMS(table_name=arguments[0], by=arguments[1], axis=arguments[2])
        divide(params)
    except ValidationError as e:
        error = create_error_message("Invalid argument format", f"The arguments for 'divide' are not in the correct format. Please check the argument types and values.", "divide")
        error_list.append(error)
    return "Success"

def validate_pivot_table(arguments, error_list, sheets_names):
    if len(arguments) != 5:
        error = create_error_message("Invalid number of arguments", f"The function 'pivot_table' requires 4 arguments: 'table_name', 'index', 'columns', 'values'.", "pivot_table")
        error_list.append(error)
        return "Failed"
    try:
        params = PIVOT_TABLE_PARAMS(table_name=arguments[0], index=arguments[1], columns=arguments[2], values=arguments[3], aggfunc=arguments[4])
        pivot_table(params)
    except ValidationError as e:
        error = create_error_message("Invalid argument format", f"The arguments for 'pivot_table' are not in the correct format. Please check the argument types and values.", "pivot_table")
        error_list.append(error)
    return "Success"

def validate_fill(arguments, error_list, sheets_names):
    if len(arguments) != 3:
        error = create_error_message("Invalid number of arguments", f"The function 'fill' requires 3 arguments: 'table_name', 'label', 'method'.", "fill")
        error_list.append(error)
        return "Failed"
    try:
        params = FILL(table_name=arguments[0], label=arguments[1], method=arguments[2])
        fill(params)
    except ValidationError as e:
        error = create_error_message("Invalid argument format", f"The arguments for 'fill' are not in the correct format. Please check the argument types and values.", "fill")
        error_list.append(error)
    return "Success"

def validate_subtable(arguments, error_list, sheets_names):
    if len(arguments) != 3:
        error = create_error_message("Invalid number of arguments", f"The function 'subtable' requires 3 arguments: 'table_name', 'labels', 'axis'.", "subtable")
        error_list.append(error)
        return "Failed"
    try:
        params = SUBTABLE(table_name=arguments[0], labels=arguments[1], axis=arguments[2])
        subtable(params)
    except ValidationError as e:
        error = create_error_message("Invalid argument format", f"The arguments for 'subtable' are not in the correct format. Please check the argument types and values.", "subtable")
        error_list.append(error)
    return "Success"

def validate_count(arguments, error_list, sheets_names):
    if len(arguments) != 4:
        error = create_error_message("Invalid number of arguments", f"The function 'count' requires 4 arguments: 'table_name', 'label', 'value', 'axis'.", "count")
        error_list.append(error)
        return "Failed"
    try:
        params = COUNT(table_name=arguments[0], label=arguments[1], value=arguments[2], axis=arguments[3])
        count(params)
    except ValidationError as e:
        error = create_error_message("Invalid argument format", f"The arguments for 'count' are not in the correct format. Please check the argument types and values.", "count")
        error_list.append(error)
    return "Success"