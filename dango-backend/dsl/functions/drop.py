from dsl.functions import DangoFunction


class DangoDrop(DangoFunction):
    def __init__(self):
        super().__init__(function_type="column_row")

    def definition(self):
        return """\
drop(table, label, axis): Drops one or more rows or columns from the table.
Parameters:
- table (DataFrame, required): The table from which the row(s) or column(s) will be dropped.
- label (str or int or list[str] or list[int] or "ALL", required): The label or list of labels of the row(s) or column(s) to be dropped. If the value is "ALL", all rows or columns will be dropped.
- axis (str or int, required):
    - 0 or "index": Indicates that one or more rows will be dropped.
    - 1 or "columns": Indicates that one or more columns will be dropped.
Output:
- A pandas DataFrame.\
"""
