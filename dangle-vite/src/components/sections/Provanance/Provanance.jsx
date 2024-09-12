import "reactflow/dist/base.css";
import ReactFlowWrapper from "./ReactFlowWrapper"; // Fix the file path casing here
import { SectionTitle } from "@/components/common/titles";

export default function Provanance() {
  return (
    <div className="h-full w-full overflow-y-scroll rounded-lg border bg-white p-4 shadow-sm">
      <SectionTitle title="Data Provenance View" />
      <ReactFlowWrapper />
    </div>
  );
}
