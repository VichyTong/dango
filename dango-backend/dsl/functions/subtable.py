from dsl.functions import DangoFunction


class DangoSubtable(DangoFunction):
    def __init__(self):
        super().__init__(function_type="table")

    def definition(self):
        return """\
subtable(table, labels, axis): Extracts a subtable from a DataFrame based on specified rows or columns.
Parameters:
- table (DataFrame, required): The table from which rows or columns will be extracted.
- labels (list[int/str], required): A list of row or column labels to be extracted.
- axis (str or int, required):
    - 0 or "index": Indicates that the labels are row labels.
    - 1 or "columns": Indicates that the labels are column labels.
Output:
- A pandas DataFrame.\
"""
