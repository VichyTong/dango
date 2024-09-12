from dsl.functions import DangoFunction


class DangoTest(DangoFunction):
    def __init__(self):
        super().__init__(function_type="summarization")

    def definition(self):
        return """\
test(table_a, label_a, table_b, label_b, strategy, axis): Compares two labels using the specified statistical test and returns a tuple (statistic, p_value).
Parameters:
- table_a (DataFrame, required): The first table on which the test will be performed.
- label_a (str or int, required): The label of the first row or column to be tested in the first table.
- table_b (DataFrame, required): The second table on which the test will be performed.
- label_b (str or int, required): The label of the second row or column to be tested in the second table.
- strategy (str, required): The statistical test to perform. Options include 't-test', 'z-test', 'chi-squared', 'pearson-correlation'.
- axis (str or int, required):
    - 0 or "index": Indicates that rows will be tested.
    - 1 or "columns": Indicates that columns will be tested.
Output:
- A tuple (statistic, p_value).\
"""
