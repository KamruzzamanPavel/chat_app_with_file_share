import Chat from "../components/Chat";
import Contacts from "../components/Contacts";
import ChatNav from "../components/ChatNav";
import ChatNavMobile from "../components/ChatNavMobile";
const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-black">
      {/* Contacts Sidebar (Hidden on Mobile) */}
      <div className="hidden sm:block">
        <Contacts />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-3/4 md:h-screen">
        {/* Sender Profile */}
        <ChatNav />

        {/* Mobile Navigation */}
        <ChatNavMobile />

        {/* Chat Component */}
        <div className="flex-1 flex flex-col p-4 overflow-y-auto bg-black">
          <Chat />
        </div>
      </div>
    </div>
  );
};

export default Layout;
