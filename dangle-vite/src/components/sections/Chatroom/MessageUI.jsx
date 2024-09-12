import clsx from "clsx"; // Import clsx

import { Button } from "@material-tailwind/react";
import PropTypes from "prop-types";
export function MultipleChoices({ choices, setUserChoice }) {
  return (
    <div className="flex flex-col gap-2">
      {choices?.map((choice) => (
        <Button
          color="black"
          size="sm"
          variant="outlined"
          key={choice}
          className="text-slate-500 w-3/5 justify-start"
          value={choice}
          onClick={() => {
            console.log("Choice selected:", choice);
            setUserChoice(choice); // Ensure this line correctly calls setUserChoice
          }}
        >
          {choice}
        </Button>
      ))}
    </div>
  );
}

MultipleChoices.propTypes = {
  choices: PropTypes.arrayOf(PropTypes.string).isRequired,
  setUserChoice: PropTypes.func.isRequired, // Add this line to propTypes
};

export function MessageUIServer({
  sender,
  message,
  isLoading,
  choices,
  setUserChoice,
}) {
  return (
    <div className="col-start-1 col-end-8 rounded-lg p-3">
      <div className="flex flex-row items-center">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-green-500 font-semibold text-white shadow-lg">
          {sender}
        </div>
        <div
          className={clsx(
            "relative ml-3 rounded-xl bg-white px-4 py-2 text-base shadow",
            { "animate-pulse": isLoading },
          )}
        >
          <div>{message}</div>
        </div>
      </div>
      <div className="ml-14 mt-2 flex flex-col justify-start">
        <MultipleChoices choices={choices} setUserChoice={setUserChoice} />
      </div>
    </div>
  );
}

MessageUIServer.propTypes = {
  sender: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  isLoading: PropTypes.bool,
  choices: PropTypes.arrayOf(PropTypes.string),
  setUserChoice: PropTypes.func.isRequired, // Add this line to propTypes
};

export function MessageUIUser({ sender, message }) {
  return (
    <div className="col-start-6 col-end-13 rounded-lg p-3">
      <div className="flex flex-row-reverse items-center justify-start">
        <div className="flex h-10 w-10  flex-shrink-0 items-center justify-center rounded-full bg-indigo-500 text-white">
          {sender}
        </div>
        <div className="relative mr-3 rounded-xl bg-indigo-100 px-4 py-2 text-base shadow">
          <div>{message}</div>
        </div>
      </div>
    </div>
  );
}
