import re


class DependenciesManager:
    def __init__(self):
        self.nodes = []

    def add_node(self, sheet_id, dependencies=None):
        if dependencies is None:
            dependencies = []
        node = {"sheet_id": sheet_id, "dependency": dependencies}
        self.nodes.append(node)

    def get_node(self, sheet_id):
        for node in self.nodes:
            if node["sheet_id"] == sheet_id:
                return node
        return None

    def get_all_nodes(self):
        return self.nodes

    def clear_all_nodes(self):
        self.nodes = []

    def remove_node(self, sheet_id):
        self.nodes = [node for node in self.nodes if node["sheet_id"] != sheet_id]

    def add_dependency(self, sheet_id, dependency):
        for node in self.nodes:
            if node["sheet_id"] == sheet_id and not self.is_dependency_exists(
                sheet_id, dependency
            ):
                node["dependency"].append(dependency)
                return True
        return False

    def is_dependency_exists(self, sheet_id, dependency):
        for node in self.nodes:
            if node["sheet_id"] == sheet_id:
                for dep in node["dependency"]:
                    if (
                        dep["sheet_id"] == dependency["sheet_id"]
                        and dep["action"] == dependency["action"]
                    ):
                        return True
        return False

    def is_exists(self, sheet_id):
        for node in self.nodes:
            if node["sheet_id"] == sheet_id:
                return True
        return False

    def display_nodes(self):
        for node in self.nodes:
            print(f"Sheet ID: {node['sheet_id']}, Dependencies: {node['dependency']}")

    def update_dependency(self, function, arguments):
        print(f"&&&& Function: {function}, Arguments: {arguments}")
        handlers = {
            "insert": self.handle_insert_statement,
            "drop": self.handle_drop_statement,
            "assign": self.handle_assign_statement,
            "move": self.handle_move_statement,
            "copy": self.handle_copy_statement,
            "count": self.handle_count_statement,
            "swap": self.handle_swap_statement,
            "transpose": self.handle_transpose_statement,
            "rearrange": self.handle_rearrange_statement,
            "divide": self.handle_divide_statement,
            "fill": self.handle_fill_statement,
            "concatenate": self.handle_concatenate_statement,
            "split": self.handle_split_statement,
            "format": self.handle_format_statement,
            "blank_table": self.handle_blank_table_statement,
            "delete_table": self.handle_delete_table_statement,
            "pivot_table": self.handle_pivot_table_statement,
            "merge": self.handle_merge_statement,
            "subtable": self.handle_subtable_statement,
            "aggregate": self.handle_aggregate_statement,
            "test": self.handle_test_statement,
        }
        handler = handlers.get(function)
        return handler(arguments) if handler else False

    def split_sheet_name(self, sheet_name):
        # Regular expression to find "v{int}" suffix
        match = re.search(r"_v(\d+)\.csv$", sheet_name)
        if match:
            # Extract base name and version number
            base_name = sheet_name[: match.start()]
            version = int(match.group(1))
        else:
            # No version number present
            if sheet_name.endswith(".csv"):
                base_name = sheet_name[: -len(".csv")]
            version = 0

        return base_name, version

    def handle_insert_statement(self, arguments):
        table_name, index, index_name, axis = arguments
        new_version = self.get_new_version(table_name)
        base_name, _ = self.split_sheet_name(table_name)
        new_table_name = f"{base_name}_v{new_version}.csv"

        action = f"insert {'row' if axis in (0, 'index') else 'column'} {index_name} at position {index}"

        dependency = {"sheet_id": table_name, "action": action}

        if self.is_exists(new_table_name):
            self.add_dependency(new_table_name, dependency)
        else:
            self.add_node(new_table_name, [dependency])

        self.display_nodes()
        return True

    def handle_drop_statement(self, arguments):
        sheet_id = arguments[0]
        base_name, version = self.split_sheet_name(sheet_id)
        new_version = version + 1
        new_sheet_id = f"{base_name}_v{new_version}.csv"
        index = arguments[1]
        action = "drop"
        if arguments[2] == "index":
            action += " row " + str(index)
        else:
            action += " column " + str(index)
        dependency = {"sheet_id": sheet_id, "action": action}
        if self.is_exists(new_sheet_id):
            self.add_dependency(new_sheet_id, dependency)
        else:
            self.add_node(new_sheet_id, [dependency])
        self.display_nodes()
        return True

    def handle_assign_statement(self, arguments):
        table_name, start_row, end_row, start_col, end_col, values = arguments
        new_version = self.get_new_version(table_name)
        base_name, _ = self.split_sheet_name(table_name)
        new_table_name = f"{base_name}_v{new_version}.csv"

        action = f"assign to cells [{start_row}:{end_row}, {start_col}:{end_col}]"
        if isinstance(values, (int, float, str)):
            action += f" value {values}"
        else:
            action += " multiple values"

        dependency = {"sheet_id": table_name, "action": action}

        if self.is_exists(new_table_name):
            self.add_dependency(new_table_name, dependency)
        else:
            self.add_node(new_table_name, [dependency])

        self.display_nodes()
        return True

    def handle_move_statement(self, arguments):
        origin_table, origin_index, target_table, target_index, axis = arguments
        new_version = self.get_new_version(target_table)
        base_name, _ = self.split_sheet_name(target_table)
        new_target_table = f"{base_name}_v{new_version}.csv"

        if axis in (0, "index"):
            action = (
                f"move row {origin_index} from {origin_table} to row {target_index}"
            )
        elif axis in (1, "columns"):
            action = f"move column {origin_index} from {origin_table} to column {target_index}"
        else:
            return False  # Invalid axis

        dependency = {"sheet_id": origin_table, "action": action}

        if self.is_exists(new_target_table):
            self.add_dependency(new_target_table, dependency)
        else:
            self.add_node(new_target_table, [dependency])

        self.display_nodes()
        return True

    def handle_copy_statement(self, arguments):
        origin_table, origin_index, target_table, target_index, axis = arguments
        new_version = self.get_new_version(target_table)
        base_name, _ = self.split_sheet_name(target_table)
        new_target_table = f"{base_name}_v{new_version}.csv"

        action = f"copy {'row' if axis in (0, 'index') else 'column'} {origin_index} from {origin_table} to {target_index}"

        dependency = {"sheet_id": origin_table, "action": action}

        if self.is_exists(new_target_table):
            self.add_dependency(new_target_table, dependency)
        else:
            self.add_node(new_target_table, [dependency])

        self.display_nodes()
        return True

    def handle_count_statement(self, arguments):
        table_name, label, value, axis = arguments
        new_version = self.get_new_version(table_name)
        base_name, _ = self.split_sheet_name(table_name)
        new_table_name = f"{base_name}_v{new_version}.csv"

        action = f"count {'row' if axis in (0, 'index') else 'column'} {label} with value {value}"

        dependency = {"sheet_id": table_name, "action": action}

        self.add_node(new_table_name, [dependency])

        self.display_nodes()
        return True

    def handle_swap_statement(self, arguments):
        table_a, label_a, table_b, label_b, axis = arguments
        new_version_a = self.get_new_version(table_a)
        new_version_b = self.get_new_version(table_b)

        base_name_a, _ = self.split_sheet_name(table_a)
        base_name_b, _ = self.split_sheet_name(table_b)
        new_table_a = f"{base_name_a}_v{new_version_a}.csv"
        new_table_b = f"{base_name_b}_v{new_version_b}.csv"

        action = f"swap {'row' if axis in (0, 'index') else 'column'} {label_a} with {label_b}"

        dependency_a = {"sheet_id": table_b, "action": action}
        dependency_b = {"sheet_id": table_a, "action": action}

        self.add_node(new_table_a, [dependency_a])
        self.add_node(new_table_b, [dependency_b])

        self.display_nodes()
        return True

    def handle_transpose_statement(self, arguments):
        (table_name,) = arguments
        new_version = self.get_new_version(table_name)
        base_name, _ = self.split_sheet_name(table_name)
        new_table_name = f"{base_name}_v{new_version}.csv"

        action = "transpose"

        dependency = {"sheet_id": table_name, "action": action}

        self.add_node(new_table_name, [dependency])

        self.display_nodes()
        return True

    def handle_rearrange_statement(self, arguments):
        table_name, by_values, axis = arguments
        new_version = self.get_new_version(table_name)
        base_name, _ = self.split_sheet_name(table_name)
        new_table_name = f"{base_name}_v{new_version}.csv"

        action = f"rearrange {'rows' if axis in (0, 'index') else 'columns'}"
        action += f" by values in {by_values}"

        dependency = {"sheet_id": table_name, "action": action}

        self.add_node(new_table_name, [dependency])

        self.display_nodes()
        return True

    def handle_divide_statement(self, arguments, output_tables=None):
        table_name, by, axis = arguments
        new_version = self.get_new_version(table_name)
        base_name, _ = self.split_sheet_name(table_name)
        new_table_name = f"{base_name}_v{new_version}.csv"

        action = f"divide by {'row' if axis in (0, 'index') else 'column'} {by}"

        dependency = {"sheet_id": table_name, "action": action}

        if output_tables is not None:
            for table in output_tables:
                base_name, _ = self.split_sheet_name(table["sheet_id"])
                name = f"{base_name}_v{table['version']}.csv"
                self.add_node(name, [dependency])
        else:
            self.add_node(new_table_name, [dependency])

        self.display_nodes()
        return True

    def handle_fill_statement(self, arguments):
        table_name, labels, method = arguments
        new_version = self.get_new_version(table_name)
        base_name, _ = self.split_sheet_name(table_name)
        new_table_name = f"{base_name}_v{new_version}.csv"

        action = f"fill row {labels} with method {method}"

        dependency = {"sheet_id": table_name, "action": action}

        self.add_node(new_table_name, [dependency])

        self.display_nodes()
        return True

    def handle_concatenate_statement(self, arguments):
        table_name, label_a, label_b, glue, new_label, axis = arguments
        new_version = self.get_new_version(table_name)
        base_name, _ = self.split_sheet_name(table_name)
        new_table_name = f"{base_name}_v{new_version}.csv"

        action = f"concatenate {'rows' if axis in (0, 'index') else 'columns'} {label_a} and {label_b} with glue '{glue}' as {new_label}"

        dependency = {"sheet_id": table_name, "action": action}

        if self.is_exists(new_table_name):
            self.add_dependency(new_table_name, dependency)
        else:
            self.add_node(new_table_name, [dependency])

        self.display_nodes()
        return True

    def handle_split_statement(self, arguments):
        table_name, label, delimiter, new_label_list, axis = arguments
        new_version = self.get_new_version(table_name)
        base_name, _ = self.split_sheet_name(table_name)
        print(base_name, table_name)
        new_table_name = f"{base_name}_v{new_version}.csv"

        action = f"split {'row' if axis in (0, 'index') else 'column'} {label} by delimiter '{delimiter}'"
        if axis in (1, "columns") and new_label_list:
            action += f" into new columns {new_label_list}"

        dependency = {"sheet_id": table_name, "action": action}

        if self.is_exists(new_table_name):
            self.add_dependency(new_table_name, dependency)
        else:
            self.add_node(new_table_name, [dependency])

        self.display_nodes()
        return True

    def handle_format_statement(self, arguments):
        table_name, label, pattern, replace_with, axis = arguments
        new_version = self.get_new_version(table_name)
        base_name, _ = self.split_sheet_name(table_name)
        new_table_name = f"{base_name}_v{new_version}.csv"

        action = f"format {'row' if axis in (0, 'index') else 'column'} {label} using pattern '{pattern}' and replace with '{replace_with}'"

        dependency = {"sheet_id": table_name, "action": action}

        if self.is_exists(new_table_name):
            self.add_dependency(new_table_name, dependency)
        else:
            self.add_node(new_table_name, [dependency])

        self.display_nodes()
        return True

    def handle_blank_table_statement(self, arguments):
        row_number, column_number = arguments
        new_table_name = f"blank_table_v0.csv"

        action = (
            f"create blank table with {row_number} rows and {column_number} columns"
        )

        self.add_node(new_table_name, [{"sheet_id": "new", "action": action}])

        self.display_nodes()
        return True

    def handle_delete_table_statement(self, arguments):
        (table_name,) = arguments

        action = f"delete table"

        self.remove_node(table_name)

        self.display_nodes()
        return True

    def handle_pivot_table_statement(self, arguments):
        table, index, columns, values, aggfunc = arguments
        new_version = self.get_new_version(table)
        base_name, _ = self.split_sheet_name(table)
        new_table_name = f"{base_name}_v{new_version}.csv"

        action = f"pivot table with index={index}, columns={columns}, values={values}, aggfunc={aggfunc}"

        dependency = {"sheet_id": table, "action": action}

        self.add_node(new_table_name, [dependency])

        self.display_nodes()
        return True

    def handle_merge_statement(self, arguments):
        table_a, table_b, how, on = arguments
        new_table_name = f"merged_v0.csv"

        action = f"merge tables {table_a} and {table_b} with how={how} and on={on}"

        dependency_a = {"sheet_id": table_a, "action": action}
        dependency_b = {"sheet_id": table_b, "action": action}

        self.add_node(new_table_name, [dependency_a, dependency_b])

        self.display_nodes()
        return True

    def handle_subtable_statement(self, arguments):
        table, rows, columns = arguments
        new_version = self.get_new_version(table)
        base_name, _ = self.split_sheet_name(table)
        new_table_name = f"{base_name}_v{new_version}.csv"

        action = f"create subtable"
        if rows:
            action += f" with rows {rows}"
        if columns:
            action += f" with columns {columns}"

        dependency = {"sheet_id": table, "action": action}

        self.add_node(new_table_name, [dependency])

        self.display_nodes()
        return True

    def handle_aggregate_statement(self, arguments):
        table, functions, axis = arguments
        new_version = self.get_new_version(table)
        base_name, _ = self.split_sheet_name(table)
        new_table_name = f"{base_name}_aggregated_v{new_version}.csv"

        action = f"aggregate {'rows' if axis in (0, 'index') else 'columns'} with functions {functions}"

        dependency = {"sheet_id": table, "action": action}

        self.add_node(new_table_name, [dependency])

        self.display_nodes()
        return True

    def handle_test_statement(self, arguments):
        return True

    def get_new_version(self, table_name):
        _, version = self.split_sheet_name(table_name)
        return version + 1
