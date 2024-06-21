import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addContact } from "../store/authSlice";
import { fetchMessages } from "../store/messageSlice";
import axios from "axios";

const Contacts = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const { user, contact, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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

  const filteredUsers = users.filter(
    (users) =>
      users._id !== user._id &&
      users.username.toLowerCase().includes(search.toLowerCase())
  );

  const addContactHandler = async (selectedUser) => {
    try {
      await dispatch(addContact(selectedUser));
      await dispatch(fetchMessages());
    } catch (error) {
      console.error("Error adding contact or fetching messages", error);
      // Handle error state or feedback to the user
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="relative md:w-1/4 bg-slate-700 p-4 border-r h-screen md:h-screen">
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
          className="w-full p-2 mb-4 border rounded bg-blue-100"
        />
        <ul>
          {filteredUsers.map((user) => (
            <li
              key={user._id}
              className={`p-2 hover:bg-blue-300 cursor-pointer my-1 font-semibold ${
                contact && contact._id === user._id
                  ? "bg-green-400"
                  : "bg-gray-200"
              }`}
              onClick={() => addContactHandler(user)}
            >
              {user.username}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Contacts;
