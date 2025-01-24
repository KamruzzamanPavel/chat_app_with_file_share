import { useState } from "react";
import { useSelector } from "react-redux"; // Assuming you use Redux to manage state
import LogoutBtn from "./LogoutBtn";
import Contacts from "./Contacts";

const ChatNav = () => {
  const { user, contact } = useSelector((state) => state.auth); // Assuming you have auth state in Redux
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible((prev) => !prev);
  };

  return (
    <div className="bg-slate-700 text-white flex md:relative fixed top-1 right-1 left-1">
      {/* Contacts (hidden on larger screens) */}
      <div className="md:hidden flex-shrink-0 absolute top-2">
        <Contacts />
      </div>

      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        {/* Chat Header */}
        <div className="flex items-center space-x-4">
          Chatting with:
          <h2 className="bg-gray-600 text-white ml-2 rounded-full px-3 py-1 text-lg font-semibold">
            {contact ? ` ${contact.username}` : "Select Contact for Chat"}
          </h2>
        </div>

        {/* User Info & Logout */}
        <div className="relative flex items-center space-x-4">
          {/* Three Dots Icon */}
          <button
            className="flex items-center justify-center p-2 rounded-full hover:bg-gray-300 focus:outline-none"
            onClick={toggleDropdown}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6 text-white hover:text-slate-900"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6h.01M12 12h.01M12 18h.01"
              />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {dropdownVisible && (
            <div className="absolute top-10 right-0 bg-gray-700 rounded-lg shadow-lg w-48 z-10">
              {user && (
                <div className="flex items-center px-4 py-2 border-b border-gray-600">
                  <img
                    src="profile.svg"
                    alt="profile"
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="ml-3 text-gray-300 text-sm font-bold">
                    {user.username}
                  </div>
                </div>
              )}
              <div className="px-4 py-2">
                <LogoutBtn />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatNav;
