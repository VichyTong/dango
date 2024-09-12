import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { IconButton } from "@material-tailwind/react";
import { Typography } from "@material-tailwind/react";
import { HotTable } from "@handsontable/react";
import { registerAllModules } from "handsontable/registry";
import "handsontable/dist/handsontable.full.min.css";
import { useFilesStore } from "@/stores/filesStore";
import { deleteCSVInBackEnd } from "@/lib/data";
import { useSessionStore } from "@/stores/sessionStore";
import { useDangoStateStore } from "@/stores/dangoStateStore";
import { parseCSVData } from "@/util/tableOperations";
import PropTypes from "prop-types";

registerAllModules();

const useCurCsvData = () => useFilesStore((state) => state.curCsvData);
const useClientId = () => useSessionStore((state) => state.client_id);
const useUpdateDemo = () => useSessionStore((state) => state.updateDemo);
const useCurState = () => useDangoStateStore((state) => state.curState);

function HandsontableWrapper() {
  const dataLength = useCurCsvData().data.length;
  return dataLength === 0 ? <NoDataDisplay /> : <TableSection />;
}

function TableSection() {
  return (
    <div className="m-2 h-full w-full">
      <FilenameSection />
      <HotTableSection />
    </div>
  );
}

function HotTableSection() {
  const { data: curCsvData } = useCurCsvData();
  const { filename: curFilename } = useCurCsvData();
  const formatedData = parseCSVData(curCsvData);
  const client_id = useClientId();
  const updateDemo = useUpdateDemo();
  const [readOnly, setReadOnly] = useState(true);
  const curState = useCurState();
  const hotTableComponentRef = useRef(null);

  useEffect(() => {
    if (curState === "RECORDING") {
      setReadOnly(false);
    } else {
      setReadOnly(true);
    }
  }, [curState]);

  const updateContentByFilename = useFilesStore(
    (state) => state.updateSheetContentByFilename,
  );

  const updateSheetContent = useCallback(
    (filename, data) => {
      // data format is [array[...], array[...], ...]
      const rows = data.map((row) => row.join(","));
      const dataString = rows.join("\n");
      updateContentByFilename(filename, dataString);
    },
    [updateContentByFilename],
  );

  const handleTableChange = useCallback(
    (changes, source) => {
      if (source === "loadData" || !changes) {
        return;
      }
      const curCsvData = hotTableComponentRef.current.hotInstance.getData();
      updateSheetContent(curFilename, curCsvData); // inplace update
      const allChanges = changes
        .map(
          ([row, col, oldVal, newVal]) =>
            `Row: ${row}, Col: ${col}, Old: ${oldVal}, New: ${newVal}`,
        )
        .join("\n");

      if (client_id && allChanges) {
        updateDemo(client_id, curFilename, allChanges);
      }
    },
    [client_id, updateDemo, curFilename],
  );

  const handleBeforeChange = useCallback((changes, source) => {
    return true; // Return true to allow the table change
  }, []);

  const handleCreateCol = useCallback(
    (index, amount) => {
      const allChanges = `Created column at index ${index}`;

      // if (client_id && allChanges && !readOnly) {
      //   updateDemo(client_id, curFilename, allChanges);
      // }
    },
    [curFilename, client_id, updateDemo, readOnly],
  );

  const handleCreateRow = useCallback(
    (index, amount) => {
      const allChanges = `Created row at index ${index}`;

      // if (client_id && allChanges && !readOnly) {
      //   updateDemo(client_id, curFilename, allChanges);
      // }
    },
    [curFilename, client_id, updateDemo, readOnly],
  );

  const handleCopy = useCallback(
    (data, coords) => {
      const { startCol, startRow, endCol, endRow } = coords[0];
      const allChanges = `Copied data from column ${startCol}, row ${startRow}, to column ${endCol}, row ${endRow} in ${curFilename}`;
      console.log("allChanges: ", allChanges);
      if (client_id && allChanges && !readOnly) {
        updateDemo(client_id, curFilename, allChanges);
      }
    },
    [curFilename, client_id, updateDemo, readOnly],
  );

  const handleCut = useCallback(
    (data, coords) => {
      const { startCol, startRow, endCol, endRow } = coords[0];
      const allChanges = `Cut data from column ${startCol}, row ${startRow}, to column ${endCol}, row ${endRow} in ${curFilename}`;
      console.log("allChanges: ", allChanges);
      if (client_id && allChanges && !readOnly) {
        updateDemo(client_id, curFilename, allChanges);
      }
    },
    [curFilename, client_id, updateDemo, readOnly],
  );

  const handlePaste = useCallback(
    (data, coords) => {
      const { startCol, startRow, endCol, endRow } = coords[0];
      const allChanges = `Pasted data from column ${startCol}, row ${startRow}, to column ${endCol}, row ${endRow} in ${curFilename}`;
      console.log("allChanges: ", allChanges);
      if (client_id && allChanges && !readOnly) {
        updateDemo(client_id, curFilename, allChanges);
      }
    },
    [curFilename, client_id, updateDemo, readOnly, curCsvData],
  );

  const handleContextMenuInsertRowAbove = useCallback(
    (key, selection, clickEvent) => {
      const allChanges = `Inserted row at index ${selection[0].start.row}`;
      console.log("allChanges: ", allChanges);
      hotTableComponentRef.current.hotInstance.alter(
        "insert_row_above",
        selection[0].start.row,
      );
      if (client_id && allChanges && !readOnly) {
        updateDemo(client_id, curFilename, allChanges);
      }
    },
    [curFilename, client_id, updateDemo, readOnly, hotTableComponentRef],
  );

  const handleContextMenuInsertRowBelow = useCallback(
    (key, selection, clickEvent) => {
      const allChanges = `Inserted row at index ${selection[0].start.row + 1}`;
      console.log("allChanges: ", allChanges);
      hotTableComponentRef.current.hotInstance.alter(
        "insert_row_below",
        selection[0].start.row,
      );
      if (client_id && allChanges && !readOnly) {
        updateDemo(client_id, curFilename, allChanges);
      }
    },
    [curFilename, client_id, updateDemo, readOnly, hotTableComponentRef],
  );

  const handleContextMenuInsertColLeft = useCallback(
    (key, selection, clickEvent) => {
      const allChanges = `Inserted column at index ${selection[0].start.col}`;
      console.log("allChanges: ", allChanges);
      hotTableComponentRef.current.hotInstance.alter(
        "insert_col_start",
        selection[0].start.col,
      );
      if (client_id && allChanges && !readOnly) {
        updateDemo(client_id, curFilename, allChanges);
      }
    },
    [curFilename, client_id, updateDemo, readOnly, hotTableComponentRef],
  );

  const handleContextMenuInsertColRight = useCallback(
    (key, selection, clickEvent) => {
      const allChanges = `Inserted column at index ${selection[0].start.col + 1}`;
      console.log("allChanges: ", allChanges);
      hotTableComponentRef.current.hotInstance.alter(
        "insert_col_start",
        selection[0].start.col + 1,
      );
      if (client_id && allChanges && !readOnly) {
        updateDemo(client_id, curFilename, allChanges);
      }
    },
    [curFilename, client_id, updateDemo, readOnly, hotTableComponentRef],
  );

  const handleColumnMove = useCallback(
    (movedColumns, finalIndex, dropIndex, movePossible, orderChanged) => {
      const allChanges = `Moved column from index ${movedColumns[0]} to index ${finalIndex}`;
      console.log("allChanges: ", allChanges);
      if (client_id && allChanges && !readOnly) {
        updateDemo(client_id, curFilename, allChanges);
      }
    },
    [curFilename, client_id, updateDemo, readOnly],
  );

  const handleRowMove = useCallback(
    (movedRows, finalIndex, dropIndex, movePossible, orderChanged) => {
      const allChanges = `Moved row from index ${movedRows[0]} to index ${finalIndex}`;
      console.log("allChanges: ", allChanges);
      if (client_id && allChanges && !readOnly) {
        updateDemo(client_id, curFilename, allChanges);
      }
    },
    [curFilename, client_id, updateDemo, readOnly],
  );

  return (
    <div className="h-full text-sm">
      <HotTable
        ref={hotTableComponentRef}
        data={formatedData}
        colHeaders={true}
        // rowHeaders={true}
        rowHeaders={(index) => index.toString()}
        contextMenu={{
          items: {
            row_above: {
              name: "Insert row above",
              callback: handleContextMenuInsertRowAbove,
            },
            row_below: {
              name: "Insert row below",
              callback: handleContextMenuInsertRowBelow,
            },
            col_left: {
              name: "Insert column on the left",
              callback: handleContextMenuInsertColLeft,
            },
            col_right: {
              name: "Insert column on the right",
              callback: handleContextMenuInsertColRight,
            },
          },
        }}
        height="95%"
        width="100%"
        licenseKey="non-commercial-and-evaluation"
        className="z-0"
        afterChange={handleTableChange}
        beforeChange={handleBeforeChange}
        readOnly={readOnly}
        afterCreateCol={handleCreateCol}
        afterCreateRow={handleCreateRow}
        afterCopy={handleCopy}
        afterCut={handleCut}
        afterPaste={handlePaste}
        afterColumnMove={handleColumnMove}
        afterRowMove={handleRowMove}
        manualColumnMove={true}
        manualRowMove={true}
      />
    </div>
  );
}
function FilenameSection() {
  const { filename } = useCurCsvData();
  const getColNumber = useFilesStore((state) => state.getColNumber);
  const getRowNumber = useFilesStore((state) => state.getRowNumber);

  return (
    <Typography variant="small" color="blue-gray" className="mb-1">
      <div className="text-align-center flex flex-row gap-2">
        <div className="flex">{filename}</div>
        (row: {getRowNumber()}, col: {getColNumber()})
        <RemoveFileButton filename={filename} />
        <DownloadFileButton filename={filename} />
      </div>
    </Typography>
  );
}

function RemoveFileButton({ filename }) {
  const removeFile = useFilesStore((state) => state.removeFile);
  const client_id = useClientId();
  const handleRemoveFile = () => {
    console.log("Removing file:", filename);
    removeFile(filename);
    deleteCSVInBackEnd(client_id, filename);
  };

  return (
    <IconButton
      variant="text"
      className="h-5 w-5 text-blue-gray-300 hover:text-blue-gray-500"
      onClick={handleRemoveFile}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="h-4 w-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
        />
      </svg>
    </IconButton>
  );
}

RemoveFileButton.propTypes = {
  filename: PropTypes.string.isRequired,
};

function DownloadFileButton({ filename }) {
  const getFileData = useFilesStore((state) => state.getFileData);
  return (
    <IconButton
      variant="text"
      className="h-5 w-5 text-blue-gray-300 hover:text-blue-gray-500"
      onClick={() => {
        const file = getFileData(filename);
        const blob = new Blob([file.data], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = file.filename;
        a.click();
        URL.revokeObjectURL;
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="h-4 w-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
        />
      </svg>
    </IconButton>
  );
}

function NoDataDisplay() {
  return (
    <div className="0 flex h-full w-full items-center justify-center">
      <p className="text-gray-400">No Data to display</p>
    </div>
  );
}

export default HandsontableWrapper;
