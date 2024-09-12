import TopNav from "@/components/common/topnav";
import ChatRoom from "@/components/sections/Chatroom/Chatroom";
import Provanance from "@/components/sections/Provanance/Provanance";
import TableView from "@/components/sections/TableView/TableView";
import AutomationSection from "@/components/sections/AutomationSection/AutomationSection";

function App() {
  return (
    <>
      <TopNav />
      <main>
        <div className="flex h-screen w-full flex-row justify-center  space-x-4 p-4 ">
          <div className="h-full w-3/5 space-y-4 overflow-y-scroll">
            <section className="flex h-3/5 flex-col">
              <TableView />
            </section>
            <section className="flex h-2/5 flex-col">
              <ChatRoom />
            </section>
          </div>
          <div className="h-full w-2/5 space-y-4 overflow-y-scroll">
            <section className="flex h-3/5  flex-col">
              <Provanance />
            </section>
            <section className="flex h-2/5  flex-col ">
              <AutomationSection />
            </section>
          </div>
        </div>
      </main>
    </>
  );
}

export default App;
