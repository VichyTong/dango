from dsl.functions import DangoFunction


class DangoCopy(DangoFunction):
    def __init__(self):
        super().__init__(function_type="column_row")

    def definition(self):
        return """\
copy(origin_table, origin_label, target_table, target_label, axis): Copies a row or column from the origin table to the target table at the specified label.
Parameters:
- origin_table (DataFrame, required): The table from which the row or column will be copied.
- origin_label (str or int, required): The label of the row or column to be copied.
- target_table (DataFrame, required): The table to which the row or column will be copied.
- target_label (str or int, required): The label at which the row or column will be placed in the target table. If this label already exists, the copied row or column will overwrite the existing one.
- axis (str or int, required): Specifies the axis along which the copy operation is performed.
    - 0 or "index": Copy a row.
    - 1 or "columns": Copy a column.
Output:
- A pandas DataFrame containing the target table with the copied row/column.\
"""
