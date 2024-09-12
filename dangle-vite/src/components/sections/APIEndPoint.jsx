import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Button,
  Select,
  Option,
  Textarea,
} from "@material-tailwind/react";
import { useState } from "react";
import {
  sendQuestionToLLMWithoutClientID,
  sendQuestionToLLMWithClientID,
} from "@/lib/data";
import { useSessionStore } from "@/stores/sessionStore";
import { useDangoStateStore } from "@/stores/dangoStateStore";

export default function APIEndPoint() {
  const [apiRequestInfo, setApiRequestInfo] = useState({
    status: "",
    sheetId: "",
    rowCount: 0,
    columnNames: [],
    tableDiff: "",
    userPrompt: "",
    clientId: "",
  });
  const [response, setResponse] = useState();

  const handleChanges = (key, value) => {
    console.log(key, value);
    setApiRequestInfo((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const sendMessageToLLM = async () => {
    let response;
    try {
      if (apiRequestInfo.clientId) {
        console.log("apiRequestInfo: ", apiRequestInfo);
        response = await sendQuestionToLLMWithClientID(
          apiRequestInfo.status,
          apiRequestInfo.userPrompt,
          apiRequestInfo.clientId,
        );
      } else {
        console.log("apiRequestInfo: ", apiRequestInfo);
        response = await sendQuestionToLLMWithoutClientID(
          apiRequestInfo.status,
          apiRequestInfo.userPrompt,
        );
      }
    } catch (error) {
      console.error("Error in sendMessageToLLM: ", error);
      response = {
        error: "Failed to get response from LLM. Please try again later.",
      };
    }
    setResponse(response);
    console.log(response);
    if (response.client_id) {
      console.log("client_id: ", response.client_id);
      setApiRequestInfo((prev) => ({
        ...prev,
        clientId: response.client_id,
      }));
    }
  };

  return (
    <section>
      <div className="flex h-screen items-center justify-center space-x-4">
        <RequestCard sendMessageToLLM={sendMessageToLLM}>
          <APISelect handleChanges={handleChanges} />
          <ClientIDInput handleChanges={handleChanges} />

          <hr className="my-1" />

          <SheetIDInput handleChanges={handleChanges} />
          <ColumnNamesInput handleChanges={handleChanges} />
          <RowCountInput handleChanges={handleChanges} />

          <hr className="my-1" />

          <TableDiffInput handleChanges={handleChanges} />
          <UserPromptInput handleChanges={handleChanges} />
        </RequestCard>

        <ResponseCard response={response} />
        <SessionDemonstrationCard />
      </div>
    </section>
  );
}

function RequestCard({ children, sendMessageToLLM }) {
  return (
    <Card className="w-2/6">
      <CardHeader
        variant="gradient"
        color="gray"
        className="mb-4 grid h-28 place-items-center"
      >
        <Typography variant="h3" color="white">
          API Endpoints
        </Typography>
      </CardHeader>
      <CardBody className="flex flex-col gap-4">{children}</CardBody>
      <CardFooter className="pt-0">
        <Button variant="gradient" fullWidth onClick={sendMessageToLLM}>
          Send Request
        </Button>
      </CardFooter>
    </Card>
  );
}

function APISelect({ handleChanges }) {
  return (
    <Select
      label="API"
      value="Simple Chat"
      onChange={(value) => {
        handleChanges("status", value);
      }}
      name="api"
    >
      <Option value="init">Simple Chat</Option>
      <Option value="with_demo">Analyze Context</Option>
      <Option value="clarification">Clarification</Option>
      <Option value="generate_dsl">Generate DSL</Option>
    </Select>
  );
}

function SheetIDInput({ handleChanges }) {
  return (
    <Input
      label="Sheet ID"
      size="lg"
      onChange={(e) => {
        handleChanges("sheetId", e.target.value);
      }}
    />
  );
}

function RowCountInput({ handleChanges }) {
  return (
    <Input
      label="Row Count"
      size="lg"
      onChange={(e) => {
        handleChanges("rowCount", e.target.value);
      }}
    />
  );
}

function ColumnNamesInput({ handleChanges }) {
  return (
    <Input
      label="Column Names e.g. [name, age, ...]"
      size="lg"
      onChange={(e) => {
        // remove [] and ""
        const columnNames = e.target.value.replace(/[\[\]\""]/g, "").split(",");
        handleChanges("columnNames", columnNames);
      }}
    />
  );
}

function TableDiffInput({ handleChanges }) {
  return (
    <Input
      label="Table Diff"
      size="lg"
      onChange={(e) => {
        handleChanges("tableDiff", e.target.value);
      }}
    />
  );
}

function UserPromptInput({ handleChanges }) {
  return (
    <Textarea
      label="User Prompt"
      size="lg"
      onChange={(e) => {
        handleChanges("userPrompt", e.target.value);
      }}
    />
  );
}

function ClientIDInput({ handleChanges }) {
  return (
    <Input
      label="Client ID"
      size="lg"
      onChange={(e) => {
        handleChanges("clientId", e.target.value);
      }}
    />
  );
}

function ResponseCard({ response }) {
  // Directly using response.response and response.history assuming they are already parsed objects
  const responseStr = response?.response;
  const historyItems = response?.history.map((item, index) => (
    <li key={index} className="list-disc">
      <span className="font-bold">{item.role}:</span> {item.content}
    </li>
  ));

  return (
    <Card className="w-2/6">
      <CardHeader
        variant="gradient"
        color="gray"
        className="mb-4 grid h-28 place-items-center"
      >
        <Typography variant="h3" color="white">
          Response
        </Typography>
      </CardHeader>
      <CardBody className="flex flex-col gap-4">
        <Typography variant="h6" color="gray">
          Response: {responseStr}
        </Typography>
        <hr className="my-1" />
        <Typography variant="h6" color="gray">
          History:
        </Typography>
        <ul className="list-inside">{historyItems}</ul>
      </CardBody>
    </Card>
  );
}

function SessionDemonstrationCard() {
  const session_demonstration = useSessionStore(
    (state) => state.session_demonstration,
  );
  const curState = useDangoStateStore((state) => state.curState);
  console.log("curState: ", curState);

  console.log("session_demonstration: ", session_demonstration);
  return (
    <Card className="w-2/6">
      <CardHeader
        variant="gradient"
        color="gray"
        className="mb-4 grid h-28 place-items-center"
      >
        <Typography variant="h3" color="white">
          Session Demonstration
        </Typography>
        {/* client_id */}
      </CardHeader>
      <CardBody className="flex flex-col gap-4">
        <Typography variant="h6" color="gray">
          Dango State: {curState}
        </Typography>
        <Typography variant="h6" color="gray">
          Client ID: {session_demonstration[0]?.client_id}
        </Typography>
        <Typography variant="h6" color="gray">
          Demonstration: {session_demonstration[0]?.demo}
        </Typography>
      </CardBody>
    </Card>
  );
}
