from dsl.functions import DangoFunction


class DangoRearrange(DangoFunction):
    def __init__(self):
        super().__init__(function_type="column_row")

    def definition(self):
        return """\
rearrange(table, by_values, by_axis): Rearranges the rows or columns of the table based on the specified order.
Parameters:
- table (DataFrame, required): The table to rearrange.
- label (str or int, required): The row or column to use as the basis for rearranging the rows or columns.
- by_axis (str or int, required):
    - 0 or "index": Rearranges the rows based on the values in the specified column.
    - 1 or "columns": Rearranges the columns based on the values in the specified row.
Output: 
- A pandas DataFrame.\
"""
