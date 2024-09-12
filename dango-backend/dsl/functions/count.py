from dsl.functions import DangoFunction


class DangoCount(DangoFunction):
    def __init__(self):
        super().__init__(function_type="summarization")

    def definition(self):
        return """\
count(table, label, value, axis): Counts the occurrences of a specified value within a given column or row in a DataFrame, then store the value in a new DataFrame.
Parameters:
- table (DataFrame, required): The DataFrame to operate on.
- label (str or int, required): The column name (if axis=0) or row label/index (if axis=1) where the value should be counted.
- value (str or int, required): The value to count within the specified column or row.
- axis (int or str, optional):
    - 0 or "index": Indicates that the count will be performed on a row.
    - 1 or "columns": Indicates that the count will be performed on a column.
Output:
- DataFrame: A new DataFrame containing the count of the specified value within the specified column or row.\
"""