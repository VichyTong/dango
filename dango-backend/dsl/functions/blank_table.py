from dsl.functions import DangoFunction


class DangoBlankTable(DangoFunction):
    def __init__(self):
        super().__init__(function_type="table")

    def definition(self):
        return """\
blank_table(row_number, column_number): Returns an empty table with the specified number of rows and columns.
Parameters:
- row_number (int, required): The number of rows in the table.
- column_number (int, required): The number of columns in the table.
Output:
- A pandas DataFrame.\
"""
