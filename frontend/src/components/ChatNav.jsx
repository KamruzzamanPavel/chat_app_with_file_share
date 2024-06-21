import { useSelector } from "react-redux"; // Assuming you use Redux to manage state
import LogoutBtn from "./LogoutBtn";

const ChatNav = () => {
  const { user, contact } = useSelector((state) => state.auth); // Assuming you have auth state in Redux

  return (
    <div className="bg-slate-700 text-white shadow-lg">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          Chatting with:
          <h2 className="bg-gray-600 text-white ml-2 rounded-full px-3 py-1 text-lg font-semibold">
            {contact ? ` ${contact.username}` : "Select Contact for Chat"}
          </h2>
        </div>
        <div className="flex items-center space-x-4">
          {user && (
            <div className="flex items-center text-lg text-gray-300 font-semibold">
              Your Profile:
              <div className="bg-gray-600 text-white ml-2 rounded-full px-3 py-1 text-lg font-semibold">
                {user.username}
              </div>
            </div>
          )}
          <LogoutBtn />
          {/* Assuming LogoutBtn is imported and styled */}
        </div>
      </div>
    </div>
  );
};

export default ChatNav;
