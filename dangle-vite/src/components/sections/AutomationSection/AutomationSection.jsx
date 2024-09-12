import AutomationList from "@/components/sections/AutomationSection/AutomationList";
import { SectionTitle } from "@/components/common/titles";
import AutomationControl from "@/components/sections/AutomationSection/AutomationControl";

export default function AutomationSection() {
  return (
    <div className="h-full w-full overflow-y-scroll rounded-lg border bg-white p-4 shadow-sm">
      <SectionTitle title="Natural Language Explanation of Sythesized Program" />

      <AutomationList />

      <AutomationControl />
    </div>
  );
}
