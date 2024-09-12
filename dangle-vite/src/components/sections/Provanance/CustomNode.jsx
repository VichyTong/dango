import { memo, useState } from "react";
import { Handle, Position } from "reactflow";
import { IconButton, Typography } from "@material-tailwind/react";

import { useFilesStore } from "@/stores/filesStore";
const useFileList = () => useFilesStore((state) => state.fileList);
const useSetCurCsvData = () => useFilesStore((state) => state.setCurCsvData);
export function CustomNode({ data }) {
  const fileList = useFileList();
  const setCurCsvData = useSetCurCsvData();
  const [showTooltip, setShowTooltip] = useState(false);

  const handleSetActiveTab = (filename) => {
    let lookup = "";

    // if filename is already in the fileList, no need to lookup
    if (fileList.find((file) => file.filename === filename)) {
      setCurCsvData(fileList.find((file) => file.filename === filename));
      return;
    }

    if (filename.includes("_v0")) {
      lookup = filename.replace("_v0", "");
    } else {
      // if the filename contains multiple .csv in the name remove the middle one
      // e.g. demo.xlsx-sheet1.csv_v1.csv -> demo.xlsx-sheet1_v1.csv

      if (filename.includes(".csv_v")) {
        lookup = filename.replace(".csv_v", "_v");
        console.log(lookup);
      } else {
        lookup = filename;
        console.log(lookup);
      }
    }
    console.log(lookup);
    const file = fileList.find((file) => file.filename === lookup);
    console.log(fileList);
    console.log(file);
    if (!file) {
      console.error("File not found:", filename);
      return;
    }
    setCurCsvData(file);
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div
        className="border-stone-400 rounded-md border-2 bg-white px-2 text-xs shadow-md hover:border-4 active:scale-95"
        onClick={() => handleSetActiveTab(data.name)}
      >
        <div className="flex  items-center justify-center align-middle">
          <div className="flex h-4 w-4 items-center justify-center">
            <IconButton
              variant="text"
              className="h-6 w-6 text-blue-gray-400 hover:text-blue-gray-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                />
              </svg>
            </IconButton>
          </div>
          <Typography
            variant="small"
            color="blue-gray"
            className="ml-2 text-xs"
          >
            {data.name}
          </Typography>
        </div>

        <Handle
          type="target"
          position={Position.Top}
          className="h-2 w-2 !bg-gray-500"
        />
        <Handle
          type="source"
          position={Position.Bottom}
          className="h-2 w-2 !bg-gray-500"
        />
      </div>
    </div>
  );
}

export default memo(CustomNode);
