from dsl.functions import DangoFunction


class DangoMerge(DangoFunction):
    def __init__(self):
        super().__init__(function_type="table")

    def definition(self):
        return """\
merge(table_a, table_b, how, on): Merges two tables based on a common column.
Parameters:
- table_a (DataFrame, required): The first table to merge.
- table_b (DataFrame, required): The second table to merge.
- how(str, required): The type of merge to be performed. Options are 'left', 'right', 'outer', 'inner', or 'fuzzy'.
- on(str, required): Column or index level names to join on. Must be present in both tables.
Output:
- A pandas DataFrame.\
"""
