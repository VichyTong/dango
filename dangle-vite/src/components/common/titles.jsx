import { Typography } from "@material-tailwind/react";

export function SectionTitle({ title }) {
  return (
    <Typography variant="h5" color="blue-gray" className="mb-1">
      {title}
    </Typography>
  );
}
