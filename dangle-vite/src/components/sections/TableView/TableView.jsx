import { useState, useRef, useEffect, useCallback } from "react";
import HandsontableWrapper from "@/components/sections/TableView/HandsonTable";
import {
  UploadFileButton,
  StartRecordButton,
  StopRecordButton,
  TableDiffButton,
  CreateFileButton,
} from "@/components/common/buttons";
import { SectionTitle } from "@/components/common/titles";
import UnderlineTabs from "@/components/sections/TableView/TableTabs";
import { useFilesStore } from "@/stores/filesStore";
import { uploadCSVToBackEnd } from "@/lib/data";
import { DangoState, useDangoStateStore } from "@/stores/dangoStateStore";
import { useSessionStore } from "@/stores/sessionStore";
import Modal from "@/components/common/modal";
import PropTypes from "prop-types";
import * as XLSX from "xlsx";

import { ChangeAccordion } from "@/components/common/ChangeAccordion";

const useClientId = () => useSessionStore((state) => state.client_id);
const useFileList = () => useFilesStore((state) => state.fileList);
const useGetSessionLength = () =>
  useSessionStore((state) => state.getSessionLength);

const useSetCurState = () => useDangoStateStore((state) => state.setCurState);
const useGetSession = () => useSessionStore((state) => state.getSession);
const useIsFileUploaded = () => useFilesStore((state) => state.isFileUploaded);

function useRecordingState(isRecording) {
  const getSessionLength = useGetSessionLength();
  const setCurState = useSetCurState();

  useEffect(() => {
    if (!isRecording) {
      setCurState(DangoState.INITIAL);
      if (getSessionLength()) {
        setCurState(DangoState.CLARIFICATION);
      }
    } else {
      setCurState(DangoState.RECORDING);
    }
  }, [isRecording, setCurState, getSessionLength]);
}

export default function TableView() {
  const [isRecording, setIsRecording] = useState(false);
  const [isDiffModalOpen, setIsDiffModalOpen] = useState(false); // State to control modal visibility
  const [isCreateFileModalOpen, setIsCreateFileModalOpen] = useState(false); // State to control modal visibility
  const fileList = useFileList();

  useRecordingState(isRecording);

  return (
    <section className="flex h-full w-full justify-between space-x-2 overflow-y-scroll rounded-lg border bg-white p-4 shadow-sm">
      <div className="flex h-full w-full flex-col overflow-x-scroll">
        <SectionTitle title="Table View" />
        <UnderlineTabs className="h-1/6" fileList={fileList} />
        <MainTable isRecording={isRecording} />
        <TableControlPanel
          isRecording={isRecording}
          setIsRecording={setIsRecording}
          setIsDiffModalOpen={setIsDiffModalOpen}
          setIsCreateFileModalOpen={setIsCreateFileModalOpen}
        />
      </div>
      <Modal
        isOpen={isDiffModalOpen}
        onClose={() => setIsDiffModalOpen(false)}
        title="📁 Table Changes"
        allowButtons={true}
      >
        {isDiffModalOpen && <SessionChanges />}
      </Modal>
      <Modal
        isOpen={isCreateFileModalOpen}
        onClose={() => setIsCreateFileModalOpen(false)}
        title="📂 Create New CSV File"
        allowButtons={false}
      >
        {isCreateFileModalOpen && (
          <CreateFileQuestions
            setIsCreateFileModalOpen={setIsCreateFileModalOpen}
          />
        )}
      </Modal>
    </section>
  );
}

function CreateFileQuestions({ setIsCreateFileModalOpen }) {
  const [fileName, setFileName] = useState("");
  const [numRows, setNumRows] = useState("");
  const [numCols, setNumCols] = useState("");

  const uploadFile = useFilesStore((state) => state.uploadFile);
  const updateSheetIdByFilename = useFilesStore(
    (state) => state.updateSheetIdByFilename,
  );
  const clientId = useClientId();
  const isFileUploaded = useIsFileUploaded();
  const setCurCsvData = useSetCurCsvData();

  const handleCreateFile = async () => {
    // if file name is not end with .csv, add .csv to the end

    let fname = fileName;
    console.log("File Name:", fname);

    if (!fname.endsWith(".csv")) {
      console.log("File name does not end with .csv");
      fname = fname + ".csv";
    }

    if (isFileUploaded(fname)) {
      console.log("File already uploaded");
      alert("File already uploaded");
      return;
    }

    // Create an empty CSV file with the specified number of rows and columns
    let csvContent = "";
    const header = Array.from(
      { length: numCols },
      (_, i) => `Column${i + 1}`,
    ).join(",");
    const rows = Array.from({ length: numRows }, () =>
      Array.from({ length: numCols }, () => " ").join(","),
    ).join("\n");

    csvContent = header + "\n" + rows;

    console.log("CSV Content:", csvContent);
    const file = new File([csvContent], fname, { type: "text/csv" });

    // Upload the file
    uploadFile(file, "");
    const response = await uploadCSVToBackEnd(file, clientId);
    updateSheetIdByFilename(fname, response.sheet_id);

    // Set the current CSV data in the global state
    const newFile = {
      filename: fname,
      data: csvContent,
      sheetId: response.sheet_id,
    };
    setCurCsvData(newFile);

    // Close the modal
    setIsCreateFileModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <label>
        <span>File Name</span>
        <input
          type="text"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          placeholder="Enter file name"
          className="w-full rounded-md border border-gray-200 p-2"
        />
      </label>
      <label>
        <span>Number of Rows</span>
        <input
          type="number"
          value={numRows}
          onChange={(e) => setNumRows(e.target.value)}
          placeholder="Enter number of rows"
          className="w-full rounded-md border border-gray-200 p-2"
        />
      </label>
      <label>
        <span>Number of Columns</span>
        <input
          type="number"
          value={numCols}
          onChange={(e) => setNumCols(e.target.value)}
          placeholder="Enter number of columns"
          className="w-full rounded-md border border-gray-200 p-2"
        />
      </label>
      <button
        onClick={handleCreateFile}
        className="rounded-md bg-blue-500 p-2 text-white"
      >
        Create File
      </button>
    </div>
  );
}

function SessionChanges() {
  const getSession = useGetSession();
  const session = getSession();

  if (!session?.[0]?.demo?.length) {
    return <NoChanges />;
  }

  return (
    <>
      {session[0].demo.map((d) => (
        <ChangeAccordion
          key={d.file_name}
          filename={d.file_name}
          changes={d.changes}
        />
      ))}
    </>
  );
}

function NoChanges() {
  return (
    <div className="flex h-96 items-center justify-center">
      <p className="text-gray-500">No changes recorded yet</p>
    </div>
  );
}

function RecordingIndicator() {
  return (
    <span className="absolute right-4 top-4 inline-flex animate-pulse items-center rounded-md bg-pink-50 px-2 py-1 text-xs font-medium text-pink-700 ring-1 ring-inset ring-pink-700/10 transition duration-300">
      <svg width="20" height="20">
        <circle cx="10" cy="10" r="5" fill="red" />
      </svg>
      Recording
    </span>
  );
}

function MainTable({ isRecording }) {
  return (
    <div className="relative my-4 h-[500px] rounded-lg border border-gray-200 p-2">
      <HandsontableWrapper />
      {isRecording && <RecordingIndicator />}
    </div>
  );
}

MainTable.propTypes = {
  isRecording: PropTypes.bool.isRequired,
};
const useSetCurCsvData = () => useFilesStore((state) => state.setCurCsvData);
const useGetFileCount = () => useFilesStore((state) => state.getFileCount);
function TableControlPanel({
  isRecording,
  setIsRecording,
  setIsDiffModalOpen,
  setIsCreateFileModalOpen,
}) {
  const fileInputRef = useRef(null);
  const uploadFile = useFilesStore((state) => state.uploadFile);
  const updateSheetIdByFilename = useFilesStore(
    (state) => state.updateSheetIdByFilename,
  );
  const isFileUploaded = useIsFileUploaded();
  const clientId = useClientId();
  const handleUploadeButtonClick = useCallback(() => {
    fileInputRef.current.click();
  }, []);
  const getSession = useGetSession();
  const session = getSession();

  const setCurCsvData = useSetCurCsvData();
  const getFileCount = useGetFileCount();
  const curFileCount = getFileCount();
  const handleFileUpload = useCallback(
    async (event) => {
      function readUploadedFile(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = e.target.result;
          const newFile = { filename: file.name, data: data, sheetId: "" };
          setCurCsvData(newFile);
        };
        reader.onerror = (e) => {
          console.error("Error reading file:", e);
        };

        reader.readAsText(file);
      }

      async function uploadFileHelper(file) {
        if (file) {
          if (isFileUploaded(file.name)) {
            console.log("File already uploaded");
            alert("File already uploaded");
            return;
          }
          uploadFile(file, "");
          const response = await uploadCSVToBackEnd(file, clientId);
          updateSheetIdByFilename(file.name, response.sheet_id);
          event.target.value = null; // reset the input field

          // ==== for setting the current CSV data in the global state ====
          readUploadedFile(file);
          // ==== for setting the current CSV data in the global state ====
        }
      }

      async function processXLSXFile(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: "array" });

          workbook.SheetNames.forEach((sheetName) => {
            const worksheet = XLSX.utils.sheet_to_csv(
              workbook.Sheets[sheetName],
            );

            // Create a Blob from the CSV string
            const blob = new Blob([worksheet], { type: "text/csv" });
            const csvFile = new File([blob], `${file.name}-${sheetName}.csv`, {
              type: "text/csv",
            });

            // Handle CSV data for each sheet
            uploadFileHelper(csvFile); // Pass the File object to the upload helper
          });
        };
        reader.onerror = (e) => {
          console.error("Error reading XLSX file:", e);
        };

        reader.readAsArrayBuffer(file);
      }

      const file = event.target.files[0];

      // if the file is not csv or xlsx, return
      if (!file.name.endsWith(".csv") && !file.name.endsWith(".xlsx")) {
        alert("File format not supported. Please upload a CSV or XLSX file");
        return;
      }

      // if it's a csv file, upload it
      if (file.name.endsWith(".csv")) {
        uploadFileHelper(file);
        return;
      }

      // if it's an xlsx file, process it
      if (file.name.endsWith(".xlsx")) {
        processXLSXFile(file);
      }
    },
    [
      uploadFile,
      updateSheetIdByFilename,
      clientId,
      isFileUploaded,
      setCurCsvData,
    ],
  );

  const handleCreateFile = () => {
    setIsCreateFileModalOpen(true);
  };
  const isPBDEnabled = import.meta.env.VITE_PBD_ENABLED === "true";
  return (
    <div className="ml-2 flex flex-row gap-2">
      <UploadFileButton onClick={handleUploadeButtonClick} />
      <CreateFileButton onClick={handleCreateFile} />
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileUpload}
      />
      {isPBDEnabled &&
        (isRecording ? (
          <StopRecordButton onClick={() => setIsRecording(false)} text="" />
        ) : (
          <StartRecordButton
            onClick={() => setIsRecording(true)}
            disabled={!curFileCount}
          />
        ))}
      {/* <TableDiffButton
        onClick={() => {
          setIsDiffModalOpen(true);
        }}
        disabled={!session?.[0]?.demo?.length}
      /> */}
    </div>
  );
}

TableControlPanel.propTypes = {
  isRecording: PropTypes.bool.isRequired,
  setIsRecording: PropTypes.func.isRequired,
  setIsDiffModalOpen: PropTypes.func.isRequired,
  setIsCreateFileModalOpen: PropTypes.func.isRequired,
};
