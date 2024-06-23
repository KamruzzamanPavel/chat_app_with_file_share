import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addContact } from "../store/authSlice";
import { fetchMessages } from "../store/messageSlice";
import axios from "axios";
import io from "socket.io-client";

const Contacts = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [activeUsers, setActiveUsers] = useState([]);
  const { user, contact, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const socket = useRef(null);

  useEffect(() => {
    socket.current = io("http://localhost:5000", {
      query: { token },
    });

    socket.current.on("activeUsers", (activeUsers) => {
      setActiveUsers(activeUsers);
    });

    return () => {
      socket.current.disconnect();
    };
  }, [token]);
  //................................................................
  const filteredActiveUsers = activeUsers.filter(
    // eslint-disable-next-line no-unused-vars
    (uId) => uId != user._id
  );
  console.log(filteredActiveUsers);
  //................................................................
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users", error);
      }
    };

    fetchUsers();
  }, [token]);
  //..........................
  const filteredUsers = users.filter(
    (users) =>
      users._id !== user._id &&
      users.username.toLowerCase().includes(search.toLowerCase())
  );
  console.log(filteredUsers);
  //........................................................................
  const addContactHandler = (selectedUser) => {
    try {
      dispatch(addContact(selectedUser));
      dispatch(fetchMessages());
    } catch (error) {
      console.error("Error adding contact or fetching messages", error);
      // Handle error state or feedback to the user
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="relative md:w-1/4 bg-slate-700 p-4 md:h-screen md:border-r border-black">
      <h2 className="hidden md:block text-white font-bold mb-1">Contacts</h2>

      <div className="md:hidden">
        <button
          onClick={toggleDropdown}
          className="bg-blue-500 text-white px-4 py-2 rounded-full font-semibold"
        >
          {isDropdownOpen ? "Close Contacts" : "Open Contacts"}
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
              className={`p-2 flex items-center rounded-sm hover:bg-blue-300 cursor-pointer text-white my-1 font-semibold ${
                contact && contact._id === user._id ? "bg-black" : "bg-gray-500"
              }`}
              onClick={() => addContactHandler(user)}
            >
              <div className="capitalize m-2 flex justify-center rounded-full p-3 items-center w-5 h-5 bg-sky-500 text-black border-sky-100 border-1">
                {user.username[0]}
              </div>
              {user.username}
              {user.active ? <>active</> : <></>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Contacts;
