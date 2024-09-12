from abc import ABC, abstractmethod


class DangoFunction(ABC):
    def __init__(self, function_type):
        self.function_type = function_type

    def classify_axis(self, axis):
        if axis in [0, "index"]:
            return 0
        elif axis in [1, "columns"]:
            return 1
        else:
            raise ValueError(f"Invalid axis: {axis}")

    def function_type(self):
        return self.function_type

    @abstractmethod
    def definition(self):
        pass
