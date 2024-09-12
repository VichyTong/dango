import dsl.functions.aggregate as aggregate
import dsl.functions.assign as assign
import dsl.functions.blank_table as blank_table
import dsl.functions.concatenate as concatenate
import dsl.functions.copy as copy
import dsl.functions.count as count
import dsl.functions.delete_table as delete_table
import dsl.functions.divide as divide
import dsl.functions.drop as drop
import dsl.functions.fill as fill
import dsl.functions.format as format
import dsl.functions.insert as insert
import dsl.functions.merge as merge
import dsl.functions.move as move
import dsl.functions.pivot_table as pivot_table
import dsl.functions.rearrange as rearrange
import dsl.functions.split as split
import dsl.functions.subtable as subtable
import dsl.functions.swap as swap
import dsl.functions.test as test
import dsl.functions.transpose as transpose


function_map = {
    "aggregate": aggregate.DangoAggregate,
    "assign": assign.DangoAssign,
    "blank_table": blank_table.DangoBlankTable,
    "concatenate": concatenate.DangoConcatenate,
    "copy": copy.DangoCopy,
    "count": count.DangoCount,
    "delete_table": delete_table.DangoDeleteTable,
    "divide": divide.DangoDivide,
    "drop": drop.DangoDrop,
    "fill": fill.DangoFill,
    "format": format.DangoFormat,
    "insert": insert.DangoInsert,
    "merge": merge.DangoMerge,
    "move": move.DangoMove,
    "pivot_table": pivot_table.DangoPivotTable,
    "rearrange": rearrange.DangoRearrange,
    "split": split.DangoSplit,
    "subtable": subtable.DangoSubtable,
    "swap": swap.DangoSwap,
    "test": test.DangoTest,
    "transpose": transpose.DangoTranspose,
}
