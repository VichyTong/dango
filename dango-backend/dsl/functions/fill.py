from dsl.functions import DangoFunction


class DangoFill(DangoFunction):
    def __init__(self):
        super().__init__(function_type="column_row")

    def definition(self):
        return """\
fill(table, method, labels): Fills missing values in the table using the specified method.
Parameters:
- table (DataFrame, required): The table in which missing values will be filled.
- labels (list[str] or str or "ALL", required): The column label or list of column labels where missing values will be filled. If the value is "ALL", missing values in all columns will be filled.
- method (str, required): The method to use for filling missing values. Choose from 'mean', 'median', 'mode'.
Output:
- A pandas DataFrame.\
"""
