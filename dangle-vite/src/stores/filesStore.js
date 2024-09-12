import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useFilesStore = create(
    persist(
        (set, get) => ({
            curCsvData: { filename: "", data: "", sheetId: "" },
            fileList: [],

            setCurCsvData: (data) => set({ curCsvData: data }),

            getRowNumber: () => { //DATA IS IN CSV FORMAT
                // split the data by new line
                const rows = get().curCsvData.data.split("\n");
                // return the number of rows
                return rows.length - 1;
            },

            getColNumber: () => {
                // split the data by new line
                const rows = get().curCsvData.data.split("\n");
                // get the first row
                const firstRow = rows[0];
                // split the first row by comma
                const cols = firstRow.split(",");
                // return the number of columns
                return cols.length;
            },

            setFileList: (list) => set({ fileList: list }),

            removeFile: (filename) => {
                set((state) => {
                    const updatedFileList = state.fileList.filter(file => file.filename !== filename);
                    const newCurCsvData = updatedFileList.length > 0 ? updatedFileList[0] : { filename: "", data: [], sheetId: "" };

                    return {
                        fileList: updatedFileList,
                        curCsvData: newCurCsvData,
                    };
                });
            },

            uploadFile: (file, sheetId) => {
                const reader = new FileReader();

                reader.onload = (e) => {
                    const newFile = { filename: file.name, data: e.target.result, sheetId };

                    set((state) => ({
                        fileList: [...state.fileList, newFile],
                        curCsvData: newFile,
                    }));
                };

                reader.onerror = (e) => {
                    console.error("Error reading file:", e);
                };

                reader.readAsText(file);
            },

            getFileData: (filename) => {
                return get().fileList.find(file => file.filename === filename);
            },

            updateSheetIdByFilename: (filename, sheetId) => {
                set((state) => {
                    const updatedFileList = state.fileList.map(file =>
                        file.filename === filename ? { ...file, sheetId } : file
                    );

                    const updatedCurCsvData = state.curCsvData.filename === filename
                        ? { ...state.curCsvData, sheetId }
                        : state.curCsvData;

                    return {
                        fileList: updatedFileList,
                        curCsvData: updatedCurCsvData,
                    };
                });
            },

            updateSheetContentByFilename: (filename, data) => {
                set((state) => {
                    const updatedFileList = state.fileList.map(file =>
                        file.filename === filename ? { ...file, data } : file
                    );

                    const updatedCurCsvData = state.curCsvData.filename === filename
                        ? { ...state.curCsvData, data }
                        : state.curCsvData;

                    return {
                        fileList: updatedFileList,
                        curCsvData: updatedCurCsvData,
                    };
                });
            },

            printList: () => {
                console.log(get().fileList);
            },

            isFileUploaded: (filename) => {
                return get().fileList.some(file => file.filename === filename);
            },

            getFileCount: () => {
                return get().fileList.length;
            },
        }),
        {
            name: "files-store",
            storage: localStorage,  // Update to use the new storage option instead of getStorage
        }
    )
);
