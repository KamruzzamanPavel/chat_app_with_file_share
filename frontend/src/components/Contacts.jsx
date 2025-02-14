import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addContact } from "../store/authSlice";
import { fetchMessages } from "../store/messageSlice";
import { fetchContacts, setNewMessageFlag } from "../store/contactsSlice";
import io from "socket.io-client";
const serverIP = `${window.location.protocol}//${window.location.hostname}:5001`;

const Contacts = () => {
  const [search, setSearch] = useState("");
  const [activeUsers, setActiveUsers] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { user, contact, token } = useSelector((state) => state.auth);
  const { contacts } = useSelector((state) => state.contacts);

  const dispatch = useDispatch();

  const socket = useRef(null);

  useEffect(() => {
    dispatch(fetchContacts(token));
  }, [dispatch, token]);

  useEffect(() => {
    socket.current = io(serverIP, {
      query: { token },
    });

    socket.current.on("activeUsers", (activeUsers) => {
      setActiveUsers(activeUsers);
    });

    return () => {
      socket.current.disconnect();
    };
  }, [token]);

  //const filteredActiveUsers = activeUsers.filter((uId) => uId !== user._id);
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

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
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
    <div className="relative  bg-slate-700 md:p-4 p-1  md:h-screen md:border-r border-black">
      <h2 className="hidden md:block text-white font-bold mb-1">Contacts</h2>

      <div className=" p-0 m-0 ">
        <button
          onClick={toggleDropdown}
          className="bg-blue-500 text-white p-1 rounded-full font-semibold md:hidden"
        >
          {isDropdownOpen ? "Close Contacts" : "Contacts"}
        </button>
      </div>

      <div className={`md:block ${isDropdownOpen ? "block" : "hidden"}`}>
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
              }}
            >
              <div className="capitalize m-2 flex justify-center rounded-full p-3 items-center w-5 h-5 bg-sky-500 text-black border-sky-100 border-1">
                {user.username[0]}
              </div>
              <div className="flex-1">
                <span>{user.username}</span>
                {
                  <p
                    className={`text-xs  italic overflow-hidden ${
                      user.newMessage ? "text-gray-200" : " text-gray-400"
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
    </div>
  );
};

export default Contacts;
