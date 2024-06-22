// import React from "react";
import Chat from "../components/Chat";
import Contacts from "../components/Contacts";
// import { useSelector } from "react-redux";
// import LogoutBtn from "../components/LogoutBtn";
import ChatNav from "../components/ChatNav";
const Layout = () => {
  // const { user, contact } = useSelector((state) => state.auth);
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-black">
      {/* Contacts Sidebar */}
      <Contacts />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-3/4 md:h-screen">
        {/* Sender Profile */}

        <ChatNav />
        {/* Chat Component */}
        <div className="flex-1 flex flex-col p-4 overflow-y-auto bg-black">
          <Chat />
        </div>
      </div>
    </div>
  );
};

export default Layout;
