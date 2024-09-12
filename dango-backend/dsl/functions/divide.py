from dsl.functions import DangoFunction


class DangoDivide(DangoFunction):
    def __init__(self):
        super().__init__(function_type="column_row")

    def definition(self):
        return """\
divide(table, by, axis): Divides the table by the specified row or column, returning a list of tables.
Parameters:
- table (DataFrame, required): The table to be divided.
- by(int/str, required): The label of the row or column by which the table will be divided.
- axis (str or int, required):
    - 0 or "index": Indicates that the table will be divided by a row. Set axis to 0 if by is a row label.
    - 1 or "columns": Indicates that the table will be divided by a column. Set axis to 1 if by is a column label.
Output:
- A list of pandas DataFrames.\
"""
