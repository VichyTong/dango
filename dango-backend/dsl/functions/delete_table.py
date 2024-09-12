from dsl.functions import DangoFunction


class DangoDeleteTable(DangoFunction):
    def __init__(self):
        super().__init__(function_type="table")

    def definition(self):
        return """\
delete_table(table_name): Deletes a table from the database.
Parameters:
- table_name (str, required): The name of the table to be deleted.
Output:
- None\
"""
