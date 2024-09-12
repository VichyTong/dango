from dsl.functions import DangoFunction


class DangoConcatenate(DangoFunction):
    def __init__(self):
        super().__init__(function_type="string_operation")

    def definition(self):
        return """\
concatenate(table, label_a, label_b, glue, new_label, axis): Concatenates two rows or columns using a string as glue and appends the merged row or column to the table.
Parameters:
- table (DataFrame, required): The table in which the rows or columns will be concatenated.
- label_a (str or int, required): The label of the first row or column to be concatenated.
- label_b (str or int, required): The label of the second row or column to be concatenated.
- glue (str, required): The string used to concatenate the two rows or columns.
- new_label (str or int, required): The label of the new row or column created by the concatenation.
- axis (str or int, required):
    - 0 or "index": Indicates that rows will be concatenated.
    - 1 or "columns": Indicates that columns will be concatenated.
Output:
- A pandas DataFrame.\
"""
