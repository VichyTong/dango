import { useRef, useState, useEffect, useCallback } from "react";
import { SendChatMessageButton } from "@/components/common/buttons";
import { SectionTitle } from "@/components/common/titles";
import { v4 as uuidv4 } from "uuid";
import { MessageUIServer, MessageUIUser } from "./MessageUI";
import { useTableMetaStore } from "@/stores/tableMetaStore";
import { useSessionStore } from "@/stores/sessionStore";
import { DangoState, useDangoStateStore } from "@/stores/dangoStateStore";
import {
  sendQuestionToLLMWithClientID,
  sendResponseToBackEnd,
  createClient,
  isFileExists,
  uploadCSVToBackEnd,
  analyzeMultiTableIntents,
} from "@/lib/data";
import PropTypes from "prop-types";
import { useFilesStore } from "@/stores/filesStore";

const useClientId = () => useSessionStore((state) => state.client_id);
const useSetClientId = () => useSessionStore((state) => state.setClientId);
const useGetSessionDemo = () =>
  useSessionStore((state) => state.getSessionDemo);
const useSession_demonstration = () =>
  useSessionStore((state) => state.session_demonstration);
const useDeleteSession = () => useSessionStore((state) => state.deleteSession);
const useGetSession = () => useSessionStore((state) => state.getSession);
const useCurState = () => useDangoStateStore((state) => state.curState);
const useSetCurState = () => useDangoStateStore((state) => state.setCurState);
const useCurCsvData = () => useFilesStore((state) => state.curCsvData);

const useClearAllMeta = () => useTableMetaStore((state) => state.clearAllMeta);

const getMappedTableDiff = (session) => {
  const table_diff_list = session[0]?.demo || [];
  return table_diff_list.map((d) => ({
    sheet_id: d.file_name,
    table_diff: d.changes,
  }));
};

export default function ChatRoom() {
  const chatRoomRef = useRef(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const clientId = useClientId();
  const setClientId = useSetClientId();
  const getSessionDemo = useGetSessionDemo();
  const getSession = useGetSession();
  const session_demonstration = useSession_demonstration();
  const deleteSession = useDeleteSession();
  const curState = useCurState();
  const setCurState = useSetCurState();
  const [userChoice, setUserChoice] = useState("");
  const clearAllMeta = useClearAllMeta();
  const { filename: curFilename } = useCurCsvData();
  const { sheetId: curSheetId } = useCurCsvData();
  const { data: curCSVData } = useCurCsvData();

  console.log("session_demonstration: ", session_demonstration);

  const updateChatHistory = useCallback((sender, message, choices) => {
    setChatHistory((currentChatHistory) => [
      ...currentChatHistory,
      { id: uuidv4(), sender, message, choices },
    ]);
  }, []);

  const sendQAResponse = useCallback(
    async (clientId, response) => {
      setIsLoading(true);
      const result = await sendResponseToBackEnd(clientId, response);
      console.log("result: ", result);
      if (result.status === "generate_dsl") {
        console.log("generate_dsl");
        setIsLoading(true);
        setCurState(DangoState.GENERATING_DSL);
      } else if (result.status === "clarification") {
        updateChatHistory("LLM", result.question, result.choices);
        setIsLoading(false);
      }
    },
    [updateChatHistory, setCurState, setIsLoading],
  );

  // todo: this should support multi files and we don't need to provide row count and  column names
  const analyzeIntents = useCallback(async () => {
    const demo = getSessionDemo(clientId, curFilename);
    if (!demo) {
      // should strengthen the condition later
      return;
    }
    setIsLoading(true);
    // === testing multi-analyze function ===
    const session = getSession();
    const mapped_table_diff = getMappedTableDiff(session);
    console.log("mapped_table_diff: ", mapped_table_diff);
    // this is the place where user finish demo and click stop recording
    const response = await analyzeMultiTableIntents(
      clientId,
      "multi_analyze",
      mapped_table_diff,
      "",
    );
    console.log("multi analyze response: ", response);
    setIsLoading(false);

    // === testing multi-analyze function ===

    const fe = await isFileExists(clientId, curFilename);
    if (fe?.message === "NO") {
      console.log("uploading file to backend");
      const file = new File([curCSVData], curFilename, { type: "text/csv" });
      await uploadCSVToBackEnd(file, clientId);
    }
    if (response.status === "generate_dsl") {
      setCurState(DangoState.GENERATING_DSL);
      setIsLoading(true);
    }
    updateChatHistory("LLM", response?.question, response?.choices);
  }, [
    clientId,
    updateChatHistory,
    getSessionDemo,
    curFilename,
    curCSVData,
    getSession,
    setCurState,
  ]);

  const sendMessageToLLM = useCallback(
    async (message) => {
      try {
        setIsLoading(true);
        const status = "multi_analyze";
        const userPrompt = message;
        const client_id = clientId;
        if (curState === DangoState.OTHER_ANSWER) {
          // this mean user choose other and then provide more details then click send
          sendQAResponse(client_id, userPrompt);
          return;
        }
        const session = getSession();
        const mapped_table_diff = getMappedTableDiff(session);
        // this is the place where user send message to LLM
        const response = await analyzeMultiTableIntents(
          client_id,
          status,
          mapped_table_diff,
          userPrompt,
        );
        console.log("Response from analyzeMultiTableIntents:", response);

        if (!response) {
          console.error(
            "Received undefined response from analyzeMultiTableIntents",
          );
          updateChatHistory(
            "LLM",
            "Sorry, I encountered an error. Please try again.",
            [],
          );
          return;
        }

        if (response.type === "question") {
          updateChatHistory("LLM", response.question, response.choices);
        } else if (response.status === "finish") {
          setCurState(DangoState.GENERATING_DSL);
        } else if (response.status === "generate_dsl") {
          console.log("generate_dsl");
          setIsLoading(true);
          setCurState(DangoState.GENERATING_DSL);
        } else if (response.status === "clarification") {
          updateChatHistory("LLM", response.question, response.choices);
        } else {
          console.warn("Unexpected response type:", response);
          updateChatHistory(
            "LLM",
            "I'm not sure how to proceed. Can you please rephrase your request?",
            [],
          );
        }
      } catch (error) {
        console.error("Error in sendMessageToLLM: ", error);
        updateChatHistory("LLM", "An error occurred. Please try again.", []);
      } finally {
        setIsLoading(false);
      }
    },
    [
      clientId,
      updateChatHistory,
      setCurState,
      curState,
      sendQAResponse,
      getSession,
    ],
  );

  const clearChatHistory = useCallback(() => {
    setChatHistory([]);
  }, []);

  const handleSendChatMessage = useCallback(() => {
    const message = chatRoomRef.current.value;
    chatRoomRef.current.value = "";
    updateChatHistory("You", message, []);
    setIsLoading(true);
    sendMessageToLLM(message);
  }, [sendMessageToLLM, updateChatHistory]);

  const initLLMData = useCallback(async () => {
    console.log("initLLMData");
    try {
      const login = await createClient();
      setClientId(login.client_id);
      console.log("login: ", login);
    } catch (error) {
      console.error("Error in initLLMData: ", error);
    }
  }, [setClientId]);

  useEffect(() => {
    // this triggers when userChoice is set
    if (userChoice?.length > 0) {
      // if userchoice contains "Other" or "other"
      console.log("curState: ", curState);
      if (
        userChoice.toLowerCase().includes("other") &&
        userChoice.toLowerCase().includes("please specify") &&
        curState !== "OTHER_ANSWER"
      ) {
        console.log("Other userChoice: ", userChoice);
        console.log("curState: ", curState);
        updateChatHistory("LLM", "Please provide more details now 😊 ⬇️", []);
        setCurState(DangoState.OTHER_ANSWER);
        chatRoomRef.current.focus();
        chatRoomRef.current.value = "Other: ";
      } else if (
        curState === "CLARIFICATION" ||
        curState === "REVIEW_DSL" ||
        curState === "INITIAL_DONE" ||
        (curState === "OTHER_ANSWER" &&
          !userChoice.toLowerCase().includes("other"))
      ) {
        updateChatHistory("You", userChoice, []);
        sendQAResponse(clientId, userChoice);
      }
      setUserChoice("");
    }
  }, [
    userChoice,
    clientId,
    sendQAResponse,
    updateChatHistory,
    setCurState,
    curState,
  ]);

  useEffect(() => {
    console.log("curState: ", curState);
    if (curState === "CLARIFICATION") {
      console.log("CLARIFICATION");
      analyzeIntents();
      // deleteSession(clientId);
    } else if (curState === "RECORDING_STOPPED") {
      console.log("RECORDING_STOPPED");
    } else if (curState === "INITIAL") {
      console.log("INITIAL");
      clearAllMeta();
      deleteSession(clientId);
      clearChatHistory();
      initLLMData();
      // note that initLLMData will login and start a new session
      // use init_done to avoid the infinite loop
      setCurState(DangoState.INITIAL_DONE);
    } else if (curState === "REVIEW_DSL") {
      setIsLoading(false);
      updateChatHistory(
        "LLM",
        "Please review the automation on your right ➡️",
        [],
      );
    }
  }, [
    curState,
    clientId,
    curFilename,
    getSessionDemo,
    analyzeIntents,
    updateChatHistory,
    clearChatHistory,
    initLLMData,
    setCurState,
    clearAllMeta,
    deleteSession,
  ]);

  const isChatroomEnabled = import.meta.env.VITE_CHATROOM_ENABLED === "true";
  // const isChatroomEnabled = false;

  return (
    <section className="h-full w-full overflow-y-scroll rounded-lg border bg-white p-4 shadow-md">
      <SectionTitle title="Chat with LLM-based Agent" />
      <ChatRoomBox>
        <ChatThreads
          chatHistory={chatHistory}
          isLoading={isLoading}
          setUserChoice={setUserChoice}
          isChatroomEnabled={isChatroomEnabled}
        />
        <ChatInputBox
          chatRoomRef={chatRoomRef}
          onSendChatMessage={handleSendChatMessage}
          isChatroomEnabled={isChatroomEnabled}
        />
      </ChatRoomBox>
    </section>
  );
}

function ChatRoomBox({ children }) {
  return (
    <section className="h-full text-gray-800 antialiased">
      <div className="flex-auto flex-shrink-0 flex-col rounded-lg bg-gray-50 p-4">
        {children}
      </div>
    </section>
  );
}

ChatRoomBox.propTypes = {
  children: PropTypes.node.isRequired,
};

function ChatThreads({
  chatHistory,
  isLoading,
  setUserChoice,
  isChatroomEnabled,
}) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  }, [chatHistory, messagesEndRef, isLoading]);

  if (!isChatroomEnabled) {
    return (
      <div className="h-[22rem] overflow-y-scroll p-4">
        <div className="grid grid-cols-12 gap-y-2">
          <div className="col-span-12 text-center text-gray-500">
            Chatroom is currently disabled.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[22rem] overflow-y-scroll p-4">
      <div className="grid grid-cols-12 gap-y-2">
        {chatHistory.map((chat) => {
          if (chat.sender === "You") {
            return (
              <MessageUIUser
                key={chat.id}
                sender={chat.sender}
                message={chat.message}
              />
            );
          } else {
            return (
              <MessageUIServer
                key={chat.id}
                sender={chat.sender}
                message={chat.message}
                choices={chat.choices}
                setUserChoice={setUserChoice}
              />
            );
          }
        })}
        {isLoading && (
          <MessageUIServer
            sender="LLM"
            message="Typing..."
            isLoading={isLoading}
          />
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

ChatThreads.propTypes = {
  chatHistory: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      sender: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired,
    }),
  ).isRequired,
  isLoading: PropTypes.bool.isRequired,
  setUserChoice: PropTypes.func.isRequired,
  isChatroomEnabled: PropTypes.bool.isRequired,
};

function ChatInputBox({ chatRoomRef, onSendChatMessage, isChatroomEnabled }) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onSendChatMessage();
    }
  };

  return (
    <div
      className={`flex h-16 w-full flex-row items-center rounded-xl bg-white px-4 ${!isChatroomEnabled ? "opacity-50" : ""}`}
    >
      <div className="ml-4 flex-grow">
        <div className="relative w-full">
          <input
            ref={chatRoomRef}
            type="text"
            className={`flex h-10 w-full rounded-xl border pl-4 focus:border-indigo-300 focus:outline-none ${
              !isChatroomEnabled ? "cursor-not-allowed bg-gray-100" : ""
            }`}
            onKeyDown={handleKeyDown}
            disabled={!isChatroomEnabled}
          />
        </div>
      </div>
      <div className="ml-4">
        <SendChatMessageButton
          onClick={onSendChatMessage}
          disabled={!isChatroomEnabled}
        />
      </div>
    </div>
  );
}

ChatInputBox.propTypes = {
  chatRoomRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  onSendChatMessage: PropTypes.func.isRequired,
  isChatroomEnabled: PropTypes.bool.isRequired,
};
