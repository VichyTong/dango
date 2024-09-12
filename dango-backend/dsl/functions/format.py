from dsl.functions import DangoFunction


class DangoFormat(DangoFunction):
    def __init__(self):
        super().__init__(function_type="string_operation")

    def definition(self):
        return """\
format(table, label, pattern, replace_with, axis): Formats the values in a row or column based on the specified pattern and "replace_with" using re.sub().
Parameters:
- table (DataFrame, required): The DataFrame in which the row or column will be formatted.
- label (str or int, required): The label of the row or column to be formatted.
- pattern (str, required): The regex pattern to apply to the values, use parentheses to capture groups.
- replace_with (str, required): The string or backreference to replace the matched pattern with.
- axis (str or int, required):
    - 0 or "index": Indicates to format a row.
    - 1 or "columns": Indicates to format a column.
Output:
- A pandas DataFrame.\
"""
