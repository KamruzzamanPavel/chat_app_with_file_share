// src/components/Chat.js
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client";
import { fetchMessages, addMessage } from "../store/messageSlice";

const Chat = () => {
  const [message, setMessage] = useState("");
  const { list } = useSelector((state) => state.messages);
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    dispatch(fetchMessages());
  }, [dispatch]);

  useEffect(() => {
    const socket = io("http://localhost:5000", {
      query: { token },
    });

    socket.on("receiveMessage", (message) => {
      dispatch(addMessage(message));
      scrollToBottom();
    });

    return () => {
      socket.disconnect();
    };
  }, [token, dispatch]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = async () => {
    if (message.trim() === "") {
      return; // Prevent sending empty messages
    }

    const socket = await io("http://localhost:5000", {
      query: { token },
    });

    socket.emit("sendMessage", message);
    setMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevents the default form submission behavior
      sendMessage();
    }
  };

  return (
    <div className="chat-container p-4 max-w-screen-md mx-auto mt-6 bg-slate-700 rounded shadow-md">
      <div className="messages mb-4 h-80 overflow-y-auto p-4 border rounded">
        {list && list.length > 0 ? (
          list.map((msg, index) => (
            <div
              key={index}
              className={`flex mb-2 ${
                msg.sender._id === user._id ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`p-2 max-w-xs rounded ${
                  msg.sender === user._id
                    ? "bg-blue-500 text-white font-semibold ml-auto"
                    : "bg-gray-100 text-black font-semibold mr-auto"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No messages</p>
        )}
        <div ref={messagesEndRef}></div>
      </div>
      <div className="flex">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown} // Call handleKeyDown on key press
          className="border p-2 flex-grow rounded"
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 hover:bg-blue-700 text-white p-2 rounded ml-2"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
