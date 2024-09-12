from dsl.functions import DangoFunction


class DangoSwap(DangoFunction):
    def __init__(self):
        super().__init__(function_type="column_row")

    def definition(self):
        return """\
swap(table_a, label_a, table_b, label_b, axis): Swaps rows or columns between two tables.
Parameters:
- table_a (DataFrame, required): The first table from which the row or column will be swapped.
- label_a (str or int, required): The label of the row or column to be swapped in the first table.
- table_b (DataFrame, required): The second table from which the row or column will be swapped.
- label_b (str or int, required): The label of the row or column to be swapped in the second table.
- axis (str or int, required):
    - 0 or "index": Indicates to swap rows.
    - 1 or "columns": Indicates to swap columns.
Output:
- A pandas DataFrame containing the first table with the swapped row or column.
- A pandas DataFrame containing the second table with the swapped row or column.\
"""
