import { useCallback, useEffect, useState, useMemo } from "react";
import { Select, Option } from "@material-tailwind/react";
import { DangoState, useDangoStateStore } from "@/stores/dangoStateStore";
import { generateDSLFromBackEnd, editDSLFromBackEnd } from "@/lib/data";
import { useSessionStore } from "@/stores/sessionStore";
import HighlightedText from "./Highlight";
import { ActionButtonGroup } from "@/components/common/buttons";
import useDslStore from "@/stores/dslStore";

function ActionItem({ id, programNL, condition, onDelete, onUpdate, index }) {
  const [isEditing, setIsEditing] = useState(false);

  const handleProgramUpdate = (newText) => {
    onUpdate(id, newText);
  };

  return (
    <li className="p-2 hover:cursor-default hover:rounded-md hover:border hover:shadow-lg">
      <div className="flex items-center">
        <div className="mr-2 flex-auto">
          <HighlightedText
            key={id}
            text={programNL}
            condition={condition}
            isEdit={isEditing}
            onUpdate={handleProgramUpdate}
          />
        </div>
        <ActionButtonGroup
          onDelete={() => {
            console.log("delete statement:", id);
            onDelete(id);
          }}
          onEdit={() => {
            console.log("edit statement:", id);
            setIsEditing(true);
          }}
          onSaveEdit={() => {
            console.log("save edit.", id);
            setIsEditing(false);
          }}
          isEdit={isEditing}
        />
      </div>
    </li>
  );
}

const useCurState = () => useDangoStateStore((state) => state.curState);
const useSetCurState = () => useDangoStateStore((state) => state.setCurState);
const useClientId = () => useSessionStore((state) => state.client_id);

export default function AutomationList() {
  const curState = useCurState();
  const setCurState = useSetCurState();
  const clientId = useClientId();
  const [selectedAutomation, setSelectedAutomation] = useState(1);
  const [isGeneratingAutomation, setIsGeneratingAutomation] = useState(false);
  const [curProgram, setCurProgram] = useState([]);
  const [NLExplanation, setNLExplanation] = useState("");

  const curDSL = useDslStore((state) => state.curDSL);
  const setDSL = useDslStore((state) => state.setDSL);
  const setRequiredTables = useDslStore((state) => state.setRequiredTables);
  const setStepByStepPlan = useDslStore((state) => state.setStepByStepPlan);
  const deleteStatement = useDslStore((state) => state.deleteStatement);

  const dslList = useDslStore((state) => state.dslList);

  useEffect(() => {
    if (curDSL.length > 0) {
      const newProgram = curDSL.map((statement) => ({
        id: statement.id,
        programNL: statement.natural_language,
        condition: statement.condition || null,
      }));
      setCurProgram(newProgram);
    } else {
      setCurProgram([]);
    }
  }, [curDSL]);

  const generateDSL = useCallback(async () => {
    setIsGeneratingAutomation(true);
    try {
      console.log("clientId: ", clientId);
      const result = await generateDSLFromBackEnd(clientId);
      console.dir(result);
      if (result.status === "finish") {
        console.log(result);
        setDSL(result.dsl.program); // No need to reverse, it's already in the correct order
        console.log(
          "result.dsl.natural_language_description: ",
          result.dsl.natural_language_description,
        );
        setNLExplanation(result.dsl.natural_language_description);
        setRequiredTables(result.dsl.required_tables);
        setStepByStepPlan(result.dsl.step_by_step_plan);
        setCurState(DangoState.REVIEW_DSL);
      } else {
        // Handle other statuses or errors
      }
    } catch (error) {
      console.error("Failed to generate DSL: ", error);
      // Optionally set error state and show in UI
    }
    setIsGeneratingAutomation(false);
  }, [clientId, setCurState, setDSL, setRequiredTables, setStepByStepPlan]);

  const regenerateDSL = useCallback(async () => {
    setIsGeneratingAutomation(true);
    try {
      const updatedDSL = await Promise.all(
        curProgram.map(async (prog) => {
          console.log("prog: ", prog);
          console.log("prog.programNL: ", prog.programNL);
          console.log("prog.condition: ", prog.condition);
          console.log("curDSL: ", curDSL);

          const templateDSL =
            curDSL.find((item) => item.id === prog.id) || curDSL[0];
          console.log("templateDSL: ", templateDSL);

          // Trim whitespace and compare
          const originalText =
            `${templateDSL.natural_language} ${templateDSL.condition || ""}`.trim();
          const currentText = 
            `${prog.programNL.trim()} ${prog.condition || ""}`.trim();
          console.log("originalText: ", originalText);
          console.log("currentText: ", currentText);
          if (originalText === currentText) {
            console.log("User did not change the instruction");
            return templateDSL;
          }

          console.log("User changed the instruction");
          // Extract only the necessary information from templateDSL
          const dslForEdit = {
            function_name: templateDSL.function_name,
            arguments: templateDSL.arguments,
            condition: templateDSL.condition || null,
          };

          // Use the programNL as the new instruction
          const result = await editDSLFromBackEnd(
            clientId,
            dslForEdit,
            prog.programNL,
          );

          console.log("Result from editDSLFromBackEnd:", result);

          if (
            result &&
            result.function_name &&
            Array.isArray(result.arguments)
          ) {
            console.log("Valid DSL result:", result);
            return {
              ...result,
              function_name: result.function_name || null,
              arguments: result.arguments || null,
              natural_language: result.natural_language || null,
              condition: result.condition || null, // Ensure condition is always present
            };
          } else {
            console.error(`Unexpected result for program ${prog.id}:`, result);
            return null;
          }
        }),
      );
      console.log("updatedDSL: ", updatedDSL);
      // Filter out any null results
      const filteredDSL = updatedDSL.filter((dsl) => dsl !== null);
      if (filteredDSL.length > 0) {
        setDSL(filteredDSL); // No need to reverse here as curProgram is already in the correct order
        setCurState(DangoState.REVIEW_DSL);
      } else {
        console.error("No valid DSL items were generated");
      }
    } catch (error) {
      console.error("Failed to regenerate DSL: ", error);
      // Optionally set error state and show in UI
    }
    setIsGeneratingAutomation(false);
  }, [clientId, curDSL, curProgram, setDSL, setCurState]);

  useEffect(() => {
    if (curState === DangoState.GENERATING_DSL) {
      generateDSL();
    } else if (curState === DangoState.REGENERATING_DSL) {
      regenerateDSL();
    }
  }, [curState, generateDSL]);

  const handleSelectChange = useCallback(
    (value) => {
      setSelectedAutomation(value);
      if (dslList[value] && dslList[value].dsl !== curDSL) {
        setDSL(dslList[value].dsl);
        setCurState(DangoState.REVIEW_DSL);
      }
      console.log("Selected Automation: ", value);
    },
    [dslList, setDSL, curDSL, setCurState],
  );

  const isDSLListEmpty = useMemo(() => dslList.length === 0, [dslList]);

  const handleDeleteStatement = useCallback(
    (id) => {
      console.log("delete statement:", id);
      deleteStatement(id);
      setCurProgram((prevProgram) =>
        prevProgram.filter((prog) => prog.id !== id),
      );
    },
    [deleteStatement],
  );

  const handleUpdateProgram = useCallback((id, newText) => {
    setCurProgram((prevProgram) =>
      prevProgram.map((prog) =>
        prog.id === id ? { ...prog, programNL: newText.trim() } : prog,
      ),
    );
  }, []);

  const isDSLStepEnabled = import.meta.env.VITE_DSL_STEP_ENABLED === "true";

  return (
    <div>
      <div className="w-full">
        <Select
          color="gray"
          label="Select an option"
          value={selectedAutomation}
          onChange={handleSelectChange}
          disabled={isDSLListEmpty}
        >
          {dslList?.map((dsl, index) => (
            <Option key={index} value={index}>
              {"Automation " + (index + 1)}
            </Option>
          ))}
        </Select>
      </div>
      <div className="mt-2 flex max-h-full flex-col space-y-4 overflow-x-scroll rounded-lg border p-6 text-base text-gray-800">
        {isGeneratingAutomation || curState == DangoState.REGENERATING_DSL ? (
          <div className="flex h-60 items-center justify-center">
            <p className="text-gray-400">Generating ...</p>
          </div>
        ) : curProgram.length === 0 ? (
          <div className="flex h-60 items-center justify-center">
            <p className="text-gray-400">No program available</p>
          </div>
        ) : isDSLStepEnabled ? (
          <ol className="list-decimal space-y-2 p-2">
            {curProgram.map((prog, index) => (
              <ActionItem
                key={prog.id}
                id={prog.id}
                programNL={prog.programNL}
                condition={prog.condition}
                onDelete={handleDeleteStatement}
                onUpdate={handleUpdateProgram}
                index={index}
              />
            ))}
          </ol>
        ) : (
          <>
            <div className="flex h-60">
              <p>{NLExplanation}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
