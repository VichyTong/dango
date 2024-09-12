from dsl.functions import DangoFunction


class DangoSplit(DangoFunction):
    def __init__(self):
        super().__init__(function_type="string_operation")

    def definition(self):
        return """\
split(table, label, delimiter, new_label_list, axis): Separates rows or columns based on a string delimiter within the values.
Parameters:
- table (DataFrame, required): The table in which the rows or columns will be split.
- label (str or int, required): The label of the row or column to be split.
- delimiter (str, required): The delimiter to use for splitting the rows or columns.
- new_label_list (list[str or int], required): The list of labels for the new rows or columns created by the split.
- axis (str or int, required):
    - 0 or 'index': Splits a row.
    - 1 or 'columns': Splits a column.
Output:
- A pandas DataFrame.\
"""
