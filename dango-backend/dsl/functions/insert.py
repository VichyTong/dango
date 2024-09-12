from dsl.functions import DangoFunction


class DangoInsert(DangoFunction):
    def __init__(self):
        super().__init__(function_type="column_row")

    def definition(self):
        return """\
insert(table, index, index_name, axis): Inserts an empty row or column at the specified index in the table. Other rows or columns will be moved down or to the right.
Parameters:
- table (DataFrame, required): The table to insert the row or column into.
- index (int, required): The position at which the new row or column will be inserted. For example, if index is 1, the new row or column will be at position 1.
- index_name (str, required): The name of the new row or column.
- axis (str or int, required):
    - 0 or "index": Indicates that a row will be inserted.
    - 1 or "columns": Indicates that a column will be inserted.
Output:
- A pandas DataFrame.\
"""
