// import React from "react";
import Chat from "../components/Chat";
import Contacts from "../components/Contacts";
import { useSelector } from "react-redux";
const Layout = () => {
  const { user, contact } = useSelector((state) => state.auth);
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Contacts Sidebar */}
      <Contacts />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-3/4 md:h-screen">
        {/* Sender Profile */}

        <div className="bg-slate-200 p-4 border-b flex justify-between ">
          {contact ? (
            <h2 className="text-xl font-semibold text-green-700">
              You are chatting with : {contact.username}
            </h2>
          ) : (
            <h2 className="text-xl font-semibold text-red-700">
              Select Contact for Chat
            </h2>
          )}
          {user && (
            <h2 className="text-xl font-semibold text-blue-700">
              Your Profile: {user.username}
            </h2>
          )}
        </div>

        {/* Chat Component */}
        <div className="flex-1 flex flex-col p-4 overflow-y-auto">
          <Chat />
        </div>
      </div>
    </div>
  );
};

export default Layout;
