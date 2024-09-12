from dsl.functions import DangoFunction


class DangoAssign(DangoFunction):
    def __init__(self):
        super().__init__(function_type="column_row")

    def definition(self):
        return """\
assign(table, start_row_index, end_row_index, start_column_index, end_column_index, values): Assigns fixed constant values to specific cells in the table.
Parameters:
- table (DataFrame, required): The table to which the values will be assigned.
- start_row_index, end_row_index (int, required): The range of row indices where the values will be assigned. Indexing starts from 0 and must be int.
- start_column_index, end_column_index (int, required): The range of column indices where the values will be assigned. Indexing starts from 0 and must be int.
- values (list[list[int/float/str]] or int/float/str, required): The constant value(s) to assign to the specified cell(s). If "values" is a list of list, the values are assigned in order from top to bottom, left to right. If "values" is a single value, it is assigned to all cells in the specified range.
Output:
- A pandas DataFrame.\
"""
