import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addContact } from "../store/authSlice";
import { fetchMessages } from "../store/messageSlice";
import { fetchContacts, setNewMessageFlag } from "../store/contactsSlice";
import LogoutBtn from "./LogoutBtn";
import io from "socket.io-client";
const serverIP = `${window.location.protocol}//${window.location.hostname}:5001`;

const ChatNavMobile = () => {
  const [search, setSearch] = useState("");
  const [activeUsers, setActiveUsers] = useState([]);
  const [showContacts, setShowContacts] = useState(false);

  const [dropdownVisible, setDropdownVisible] = useState(false);

  const { user, contact, token } = useSelector((state) => state.auth);
  const { contacts } = useSelector((state) => state.contacts);

  const dispatch = useDispatch();
  const socket = useRef(null);
  //.............

  useEffect(() => {
    dispatch(fetchContacts(token));
  }, [dispatch, token]);

  useEffect(() => {
    socket.current = io(serverIP, { query: { token } });

    socket.current.on("activeUsers", (activeUsers) => {
      setActiveUsers(activeUsers);
    });

    return () => {
      socket.current.disconnect();
    };
  }, [token]);

  const filteredActiveUsers = user
    ? activeUsers.filter((uId) => uId !== user._id)
    : [];
  let filteredUsers = contacts.filter(
    (users) =>
      user &&
      users._id !== user._id &&
      users.username.toLowerCase().includes(search.toLowerCase())
  );

  filteredUsers = filteredUsers.map((user) => ({
    ...user,
    active: filteredActiveUsers.includes(user._id),
  }));

  const addContactHandler = (selectedUser) => {
    try {
      dispatch(addContact(selectedUser));
      dispatch(fetchMessages());
    } catch (error) {
      console.error("Error adding contact or fetching messages", error);
    }
  };

  const openChat = (contactId) => {
    dispatch(
      setNewMessageFlag({
        contactId,
        hasNewMessage: false,
      })
    );
  };

  return (
    <div className="sm:hidden fixed top-0 left-0 right-0 bg-slate-800 text-white p-2 flex justify-between items-center shadow-md z-50">
      {/* Contact Name */}
      <div className="flex items-center">
        <h2 className="bg-gray-700 text-white px-3 py-1 rounded-lg text-sm">
          Current chat &nbsp;
          <span className="text-green-400 font-bold">
            {contact ? contact.username : "No Contact Selected"}
          </span>
        </h2>
      </div>

      {/* Icons Section */}
      <div className="flex items-center space-x-4">
        {/* Toggle Contacts Button */}
        <button onClick={() => setShowContacts(!showContacts)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6 text-white"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 6h14M5 12h14M5 18h14"
            />
          </svg>
        </button>

        {/* Three Dots Dropdown */}
        <button onClick={() => setDropdownVisible(!dropdownVisible)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6 text-white"
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
          <div className="absolute top-12 right-2 bg-gray-700 rounded-lg shadow-lg w-36 z-10">
            {user && (
              <div className="px-4 py-2 border-b border-gray-600 text-center">
                <span className="text-gray-300 text-sm font-bold">
                  {user.username}
                </span>
              </div>
            )}
            <div className="px-4 py-2">
              <LogoutBtn />
            </div>
          </div>
        )}
      </div>

      {/* Slide-in Contacts (for Mobile) */}
      {showContacts && (
        <div className="absolute top-12 left-0 right-0 bg-slate-900 p-3 shadow-lg max-h-80 overflow-auto">
          <input
            type="text"
            placeholder="Search contacts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 mb-4 rounded-sm bg-sky-500 text-slate-200 placeholder-white focus:outline-none focus:ring-2 focus:ring-sky-400"
          />

          <ul className="border-t border-black">
            {filteredUsers.map((user) => (
              <li
                key={user._id}
                className={`p-2 flex items-center rounded-sm hover:bg-sky-800 bg-black cursor-pointer text-white my-1 font-semibold 
                ${contact && contact._id === user._id ? "border-r " : ""}
                ${user.newMessage ? "border-2 border-white" : ""}
              `}
                onClick={() => {
                  addContactHandler(user);
                  openChat(user._id);
                  setShowContacts(false);
                }}
              >
                <div className="capitalize m-2 flex justify-center rounded-full p-3 items-center w-5 h-5 bg-sky-500 text-black border-sky-100 border-1">
                  {user.username[0]}
                </div>
                <div className="flex-1">
                  <span>{user.username}</span>
                  {
                    <p
                      className={`text-xs italic overflow-hidden ${
                        user.newMessage ? "text-gray-200" : "text-gray-400"
                      }`}
                    >
                      {user.lastMessage ? user.lastMessage.slice(0, 15) : ""}
                    </p>
                  }
                </div>
                {user.active && (
                  <div className="ml-auto h-2 w-2 bg-green-400 rounded-full"></div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ChatNavMobile;
