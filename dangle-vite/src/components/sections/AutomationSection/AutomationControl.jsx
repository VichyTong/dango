import {
  RunProgramButton,
  SaveProgramButton,
  RemoveProgramButton,
  RegenerateProgram,
  CreateNewStatementButton,
} from "@/components/common/buttons";

import { useDslStore } from "@/stores/dslStore"; // Import the dslStore
import { useSessionStore } from "@/stores/sessionStore"; // Import the sessionStore
import { useFilesStore } from "@/stores/filesStore"; // Import the filesStore
import { DangoState, useDangoStateStore } from "@/stores/dangoStateStore";
import { useDependencyStore } from "@/stores/dependencyStore";

import {
  executeDSLFromBackEnd,
  uploadCSVToBackEnd,
  executeDSLListFromBackEnd,
  getDependencies,
} from "@/lib/data";
import { jsonToCsv } from "@/util/tableOperations";

export default function AutomationControl() {
  const curDSL = useDslStore((state) => state.curDSL);
  const setDSL = useDslStore((state) => state.setDSL);
  const addDSL2List = useDslStore((state) => state.addDSL2List);
  const deleteDSLFromList = useDslStore((state) => state.deleteDSLFromList);
  const clientId = useSessionStore((state) => state.client_id);
  const { filename: sheetId } = useFilesStore((state) => state.curCsvData);
  const isFileUploaded = useFilesStore((state) => state.isFileUploaded);
  const uploadFile = useFilesStore((state) => state.uploadFile);
  const setCurCsvData = useFilesStore((state) => state.setCurCsvData);
  const setCurState = useDangoStateStore((state) => state.setCurState);
  const curState = useDangoStateStore((state) => state.curState);
  const updateDependencyList = useDependencyStore(
    (state) => state.updateDependencyList,
  );
  const requiredTables = useDslStore((state) => state.getRequiredTables());
  const stepByStepPlan = useDslStore((state) => state.getStepByStepPlan());

  const updateFiles = (sheet_list) => {
    if (sheet_list.length === 0) {
      console.error("Sheet list is empty");
      return;
    }
    console.dir(sheet_list);
    sheet_list.forEach(async (sheet) => {
      const { sheet_id, version, data } = sheet;
      console.log("sheet_id:", sheet_id);
      console.log("version:", version);
      console.log("data:", data);

      const newName = `${sheet_id.replace(".csv", "")}_v${version}.csv`;
      if (isFileUploaded(newName)) {
        console.log("File already uploaded");
        return;
      }
      const keys = Object.keys(data);
      const rowIndices = new Set();

      // Collect all unique row indices
      keys.forEach((key) => {
        Object.keys(data[key]).forEach((index) => {
          rowIndices.add(index);
        });
      });

      const header = keys.join(",");

      let rows = [];

      rowIndices.forEach((index) => {
        let row = [];
        keys.forEach((key) => {
          let value = data[key][index] !== undefined ? data[key][index] : ""; // Handle missing values
          if (typeof value === "string" && value.includes(",")) {
            value = `"${value.trim()}"`; // Handle commas in data and trim spaces
          }
          row.push(value);
        });
        rows.push(row.join(","));
      });

      rows = [header, ...rows];
      const csvContent = rows.join("\n");
      console.log("csvContent:", csvContent);

      const file = new File([csvContent], newName, { type: "text/csv" });
      uploadFile(file, "");
      setCurCsvData({ filename: newName, data: csvContent, sheetId: sheet_id });
    });
  };

  const handleRunProgram = async () => {
    try {
      const dsl = {
        required_tables: requiredTables,
        program: curDSL,
        step_by_step_plan: stepByStepPlan,
      };

      console.log("dsl:", dsl);
      const sheet_list = await executeDSLListFromBackEnd(clientId, dsl);
      console.log("sheet_list:", sheet_list);

      const dependencies = await getDependencies();
      updateDependencyList(dependencies?.dependencies);

      console.log("sheet_list:", sheet_list);
      updateFiles(sheet_list);
      setCurState(DangoState.INITIAL_DONE);

      console.log("Program execution result:", sheet_list);
      // Handle the result as needed (e.g., update UI, show success message)
    } catch (error) {
      console.error("Error executing program:", error);
      // Handle the error (e.g., show error message to user)
    }
  };

  const handleSaveProgram = () => {
    console.log("Saving program");
    addDSL2List(curDSL);
  };

  const handleRemoveProgram = () => {
    console.log("Removing program");
    setDSL([]);
    deleteDSLFromList(curDSL);
  };

  const handleRegenerate = () => {
    // set dango state to regenerating dsl
    setCurState(DangoState.REGENERATING_DSL);
  };

  const handleCreateNewStatement = () => {
    console.log("Creating new statement");
    addEmptyDSL();
  };

  const addEmptyDSL = useDslStore((state) => state.addEmptyDSL);

  const disabled = curDSL.length === 0;
  const isEdit = curState == "EDIT_DSL";
  const isRegenerating = curState == "REGENERATING_DSL";
  const isDSLStepEnabled = import.meta.env.VITE_DSL_STEP_ENABLED === "true";

  return (
    <>
      {!isRegenerating && (
        <div className="mt-2 flex flex-row items-center gap-2">
          <RunProgramButton
            onClick={handleRunProgram}
            disabled={disabled || isEdit}
          />
          <SaveProgramButton
            onClick={handleSaveProgram}
            disabled={disabled || isEdit}
          />
          <RemoveProgramButton
            onClick={handleRemoveProgram}
            disabled={disabled || isEdit}
          />
          {isDSLStepEnabled && (
            <CreateNewStatementButton
              onClick={handleCreateNewStatement}
              disabled={disabled || isEdit}
            />
          )}
          {isEdit ? (
            <RegenerateProgram onClick={handleRegenerate} disabled={disabled} />
          ) : (
            <></>
          )}
        </div>
      )}
    </>
  );
}
