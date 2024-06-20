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
  //...................................................
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
  //.....................................................
  const filteredUsers = users
    .filter((users) => users._id !== user._id)
    .filter((users) =>
      users.username.toLowerCase().includes(search.toLowerCase())
    );
  //addContact handler...............................................
  const addContactHandler = async (selectedUser) => {
    try {
      await dispatch(addContact(selectedUser)); // Update selected contact
      await dispatch(fetchMessages()); // Fetch messages for selected contact
    } catch (error) {
      console.error("Error adding contact or fetching messages", error);
      // Handle error state or feedback to the user
    }
  };
  //.................................
  return (
    <div className="w-full md:w-1/4 bg-white p-4 border-r h-1/4 md:h-screen">
      <h2 className="text-xl font-semibold mb-4">Contacts</h2>
      <input
        type="text"
        placeholder="Search contacts..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-2 mb-4 border rounded bg-blue-100"
      />
      <ul>
        {filteredUsers.map((users) => (
          <li
            key={users._id}
            className={`p-2 hover:bg-blue-300 cursor-pointer my-1 font-semibold ${
              contact && contact._id == users._id
                ? "bg-green-400"
                : " bg-gray-200"
            }`}
            onClick={() => addContactHandler(users)}
          >
            {users.username}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Contacts;
