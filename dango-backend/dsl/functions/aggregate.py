from dsl.functions import DangoFunction


class DangoAggregate(DangoFunction):
    def __init__(self):
        super().__init__(function_type="summarization")

    def definition(self):
        return """\
aggregate(table, functions, axis): Aggregates the table using a specified function.
Parameters:
- table (DataFrame, required): table to be aggregated.
- functions (dict, required): Keys are the names of rows or columns, and values are lists of function names. Example: {'A': ['sum', 'mean'], 'B': ['min', 'max']}.
- axis (str or int, required):
    - 0 or "index": Applies the aggregate operations on rows, with the keys in the functions dictionary corresponding to row names.
    - 1 or "columns": Applies the aggregate operations on columns, with the keys in the functions dictionary corresponding to column names.
Output:
- A pandas DataFrame.\
"""
