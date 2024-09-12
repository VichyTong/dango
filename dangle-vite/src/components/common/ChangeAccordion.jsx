import React from "react";
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";

function Icon({ id, open }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={`${id === open ? "rotate-180" : ""} h-5 w-5 transition-transform`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
      />
    </svg>
  );
}

export function ChangeAccordion({ filename, changes }) {
  const [open, setOpen] = React.useState(true);
  const allChanges = changes.split("\n");

  const handleOpen = () => setOpen(!open);

  return (
    <>
      <Accordion open={open} icon={<Icon id={1} open={open} />}>
        <AccordionHeader onClick={() => handleOpen()}>
          {filename}
        </AccordionHeader>
        <AccordionBody className="max-h-96 overflow-y-auto">
          <table className="w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                <th className="border p-2">Row</th>
                <th className="border p-2">Column</th>
                <th className="border p-2">Old Value</th>
                <th className="border p-2">New Value</th>
              </tr>
            </thead>
            <tbody>
              {allChanges.map((change, index) => {
                const [row, col, oldVal, newVal] = change
                  .split(", ")
                  .map((item) => item.split(": ")[1]);
                return (
                  <tr key={index} className="border-b">
                    <td className="border p-2">{row}</td>
                    <td className="border p-2">{col}</td>
                    <td className="border p-2">{oldVal}</td>
                    <td className="border p-2">{newVal}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </AccordionBody>
      </Accordion>
    </>
  );
}
