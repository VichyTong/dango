export const contextMenuItems = {
    items: {
        row_above: {
            name: "Insert row above",
            callback: function (key, selection, clickEvent) {
                // Call the original functionality
                console.log(selection);
                this.alter('insert_row_above', selection[0].start.row);

                // Custom callback logic
                console.log('Row inserted above at index:', selection.start.row);
            }
        },
        row_below: {
            name: "Insert row below",
            callback: function (key, selection, clickEvent) {
                // Call the original functionality
                console.log(selection);
                this.alter('insert_row', selection[0].start.row + 1);

                // Custom callback logic
                console.log('Row inserted below at index:', selection.start.row + 1);
            }
        },
        col_left: {
            name: "Insert column on the left",
            callback: function (key, selection, clickEvent) {
                // Call the original functionality
                console.log(selection);
                this.alter('insert_col', selection.start.col);

                // Custom callback logic
                console.log('Column inserted to the left at index:', selection.start.col);
            }
        },
        col_right: {
            name: "Insert column on the right",
            callback: function (key, selection, clickEvent) {
                // Call the original functionality
                console.log(selection);
                this.alter('insert_col', selection.start.col + 1);

                // Custom callback logic
                console.log('Column inserted to the right at index:', selection.start.col + 1);
            }
        },
    }
};
