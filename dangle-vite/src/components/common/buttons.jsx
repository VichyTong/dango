import { Button } from "@material-tailwind/react";
export function UploadFileButton({ onClick }) {
  return (
    <div>
      <Button
        variant="outlined"
        className="my-2 flex items-center gap-1 border border-gray-300
                  px-3
                  py-2
                  font-semibold
                  text-gray-800
                  shadow-sm
                  hover:scale-105
                  active:scale-100"
        onClick={onClick}
      >
        <svg
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="h-5 w-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
          />
        </svg>
        Upload
      </Button>
    </div>
  );
}
export function CreateFileButton({ onClick }) {
  return (
    <div>
      <Button
        variant="outlined"
        className="my-2 flex items-center gap-1 border border-gray-300
                  px-3
                  py-2
                  font-semibold
                  text-gray-800
                  shadow-sm
                  hover:scale-105
                  active:scale-100"
        onClick={onClick}
      >
        <svg
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="h-5 w-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
        Create
      </Button>
    </div>
  );
}

export function TableDiffButton({ onClick, disabled }) {
  return (
    <div>
      <Button
        variant="outlined"
        className="my-2 flex items-center gap-1 border border-gray-300
                  px-3
                  py-2
                  font-semibold
                  text-gray-800
                  shadow-sm
                  hover:scale-105
                  active:scale-100"
        onClick={onClick}
        disabled={disabled}
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
            d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0 1 12 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h7.5"
          />
        </svg>
        Table Demo
      </Button>
    </div>
  );
}

export function RunProgramButton({ onClick, disabled }) {
  return (
    <div>
      <Button
        variant="outlined"
        className="my-2 flex items-center gap-1 border border-gray-300
                  px-3
                  py-2
                  font-semibold
                  text-gray-800
                  shadow-sm
                  hover:scale-105
                  active:scale-100"
        onClick={onClick}
        disabled={disabled}
      >
        <svg
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-5 w-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
          />
        </svg>
        RUN
      </Button>
    </div>
  );
}

export function SaveProgramButton({ onClick, disabled }) {
  return (
    <div>
      <Button
        variant="outlined"
        className="my-2 flex items-center gap-1 border border-gray-300
                  px-3
                  py-2
                  font-semibold
                  text-gray-800
                  shadow-sm
                  hover:scale-105
                  active:scale-100"
        onClick={onClick}
        disabled={disabled}
      >
        <svg
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-5 w-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
          />
        </svg>
        Save
      </Button>
    </div>
  );
}

export function RemoveProgramButton({ onClick, disabled }) {
  return (
    <div>
      <Button
        variant="outlined"
        className="my-2 flex items-center gap-1 border border-gray-300
                  px-3
                  py-2
                  font-semibold
                  text-gray-800
                  shadow-sm
                  hover:scale-105
                  active:scale-100"
        onClick={onClick}
        disabled={disabled}
      >
        <svg
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-5 w-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
          />
        </svg>
        Remove
      </Button>
    </div>
  );
}

export function CreateNewStatementButton({ onClick, disabled }) {
  return (
    <div>
      <Button
        variant="outlined"
        className="my-2 flex items-center gap-1 border border-gray-300
                  px-3
                  py-2
                  font-semibold
                  text-gray-800
                  shadow-sm
                  hover:scale-105
                  active:scale-100"
        onClick={onClick}
        disabled={disabled}
      >
        <svg
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="h-5 w-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
        Statement
      </Button>
    </div>
  );
}

export function RegenerateProgram({ onClick, disabled }) {
  return (
    <div>
      <Button
        variant="outlined"
        className="my-2 flex items-center gap-1 border border-gray-300
                  px-3
                  py-2
                  font-semibold
                  text-gray-800
                  shadow-sm
                  hover:scale-105
                  active:scale-100"
        onClick={onClick}
        disabled={disabled}
      >
        <svg
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-5 w-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
          />
        </svg>
        Regenerate
      </Button>
    </div>
  );
}

export function ShowHistoryButton() {
  return (
    <div>
      <Button
        variant="outlined"
        className="my-2 flex items-center gap-1 border border-gray-300
                  px-3
                  py-2
                  font-semibold
                  text-gray-800
                  shadow-sm
                  hover:scale-105
                  active:scale-100"
      >
        <svg
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="h-5 w-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
        Show History
      </Button>
    </div>
  );
}

export function SendChatMessageButton({ onClick, disabled }) {
  return (
    <div>
      <Button
        className={`flex h-10 flex-shrink-0 items-center justify-center rounded-lg px-4 py-1 text-white ${
          disabled
            ? "cursor-not-allowed bg-indigo-300"
            : "bg-indigo-500 hover:bg-indigo-600"
        }`}
        onClick={onClick}
        disabled={disabled}
      >
        <span>Send</span>
        <span className="ml-2">
          <svg
            className="-mt-px h-4 w-4 rotate-45 transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            ></path>
          </svg>
        </span>
      </Button>
    </div>
  );
}

export function GenerateCodeButton() {
  return (
    <div>
      <Button
        variant="outlined"
        className="my-2 flex items-center gap-1 border border-gray-300
                  px-3
                  py-2
                  font-semibold
                  shadow-sm
                  hover:scale-105
                  active:scale-100"
      >
        <svg
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m6.75 7.5 3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0 0 21 18V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v12a2.25 2.25 0 0 0 2.25 2.25Z"
          />
        </svg>
        Generate Code
      </Button>
    </div>
  );
}

export function RefreshSessionButton({ onClick }) {
  return (
    <div>
      <button
        className="flex items-center justify-center text-gray-400 hover:text-gray-600"
        onClick={onClick}
      >
        <svg
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="h-5 w-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
          />
        </svg>
      </button>
    </div>
  );
}

export function StartRecordButton({ onClick, disabled }) {
  return (
    <div>
      <Button
        variant="outlined"
        className="my-2 flex items-center gap-1 border border-gray-300
                  px-3
                  py-2
                  font-semibold
                  text-gray-800
                  shadow-sm
                  hover:scale-105
                  active:scale-100"
        onClick={onClick}
        disabled={disabled}
      >
        <svg
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="h-5 w-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z"
          />
        </svg>
        Record
      </Button>
    </div>
  );
}

export function StopRecordButton({ onClick }) {
  return (
    <div>
      <Button
        className="my-2 flex items-center gap-1 border border-gray-300
                  px-3
                  py-2
                  font-semibold
                  shadow-none
                  hover:scale-105
                  hover:shadow-sm
                  hover:shadow-red-100
                  active:scale-100"
        onClick={onClick}
        color="red"
      >
        <svg
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="h-5 w-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M12 18.75H4.5a2.25 2.25 0 0 1-2.25-2.25V9m12.841 9.091L16.5 19.5m-1.409-1.409c.407-.407.659-.97.659-1.591v-9a2.25 2.25 0 0 0-2.25-2.25h-9c-.621 0-1.184.252-1.591.659m12.182 12.182L2.909 5.909M1.5 4.5l1.409 1.409"
          />
        </svg>
        <p className="">Stop Record</p>
      </Button>
    </div>
  );
}

export function AskAIButton({ onClick }) {
  return (
    <div>
      <Button
        variant="outlined"
        className="my-2 flex items-center gap-1 border border-gray-300
                  px-3
                  py-2
                  font-semibold
                  text-gray-800
                  shadow-sm
                  hover:scale-105
                  active:scale-100"
        onClick={onClick}
      >
        <svg
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="h-5 w-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
          />
        </svg>
        Ask AI
      </Button>
    </div>
  );
}

export function ActionButtonGroup({ onEdit, onDelete, onSaveEdit, isEdit }) {
  return !isEdit ? (
    <div className="flex space-x-2">
      <Button
        className="rounded bg-blue-500 px-2 py-1 text-white"
        onClick={onEdit}
      >
        Edit
      </Button>
      <Button
        className="rounded bg-red-500 px-2 py-1 text-white"
        onClick={onDelete}
      >
        <p className="content-center items-center justify-items-center text-xs font-medium">
          Delete
        </p>
      </Button>
    </div>
  ) : (
    <div className="flex space-x-2">
      <Button
        className="rounded bg-green-500 px-2 py-1 text-white"
        onClick={onSaveEdit}
      >
        Save
      </Button>
      <Button
        className="rounded bg-red-500 px-2 py-1 text-white"
        onClick={onDelete}
      >
        <p className="content-center items-center justify-items-center text-xs font-medium">
          Delete
        </p>
      </Button>
    </div>
  );
}
