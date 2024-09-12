import { Tabs, TabsHeader, Tab } from "@material-tailwind/react";
import { useFilesStore } from "../../../stores/filesStore";
import { useMemo, useCallback } from "react";
import PropTypes from "prop-types";

const useSetCurCsvData = () => useFilesStore((state) => state.setCurCsvData);
const useActiveFile = () => useFilesStore((state) => state.curCsvData);

export default function UnderlineTabs({ fileList }) {
  const setCurCsvData = useSetCurCsvData();
  const { filename: activeFilename } = useActiveFile();
  const labels = useMemo(
    () => fileList.map((file) => file.filename),
    [fileList],
  );

  const handleSetActiveTab = useCallback(
    (filename) => {
      const file = fileList.find((file) => file.filename === filename);
      setCurCsvData(file);
    },
    [fileList, setCurCsvData],
  );
  console.log("activeFilename", activeFilename);
  return (
    <Tabs value={activeFilename} className="overflow-auto">
      <TabsHeader
        className="rounded-none border-b border-blue-gray-50 bg-transparent p-0"
        indicatorProps={{
          className: "bg-transparent shadow-none rounded-none font-bold",
        }}
      >
        {labels.map((label) => (
          <Tab
            key={label}
            value={label}
            onClick={() => handleSetActiveTab(label)}
            className={
              activeFilename === label
                ? "text-gray-900"
                : "text-gray-500 hover:text-gray-700"
            }
          >
            {label}
          </Tab>
        ))}
      </TabsHeader>
    </Tabs>
  );
}

UnderlineTabs.propTypes = {
  fileList: PropTypes.arrayOf(
    PropTypes.shape({
      filename: PropTypes.string.isRequired,
      // other file properties if any
    }),
  ).isRequired,
};
