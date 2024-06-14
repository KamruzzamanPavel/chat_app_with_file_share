// src/components/Chat.js
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client";
import { fetchMessages, addMessage } from "../store/messageSlice";

const Chat = () => {
  const [message, setMessage] = useState("");
  const { list } = useSelector((state) => state.messages);
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  console.log(user);

  useEffect(() => {
    dispatch(fetchMessages());
  }, [dispatch]);

  useEffect(() => {
    const socket = io("http://localhost:5000", {
      query: { token },
    });

    socket.on("receiveMessage", (message) => {
      dispatch(addMessage(message));
    });

    return () => {
      socket.disconnect();
    };
  }, [token, dispatch]);

  const sendMessage = async () => {
    const socket = await io("http://localhost:5000", {
      query: { token },
    });

    socket.emit("sendMessage", message, user);
    setMessage("");
  };

  return (
    <div className="chat-container p-4 max-w-screen-md mx-auto mt-6 bg-white rounded shadow-md">
      <div className="messages mb-4 h-64 overflow-y-auto p-2 border rounded">
        {list && list.length > 0 ? (
          <>
            {list.map((msg, index) => (
              <div
                key={index}
                className="mb-2 p-2 bg-gray-100 rounded text-black"
              >
                <strong>{msg.sender.username}: </strong>
                {msg.content}
              </div>
            ))}
          </>
        ) : (
          <p>No msg</p>
        )}
      </div>
      <div className="flex">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="border p-2 flex-grow mr-2 rounded"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 hover:bg-blue-700 text-white p-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
