import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client";
import { addMessage } from "../store/messageSlice";

const Chat = () => {
  const [message, setMessage] = useState("");
  const { list } = useSelector((state) => state.messages);
  const { user, contact, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);
  const socket = useRef(null);

  useEffect(() => {
    socket.current = io("http://localhost:5000", {
      query: { token },
    });

    socket.current.on("receiveMessage", (message) => {
      dispatch(addMessage(message));
      scrollToBottom();
    });

    return () => {
      socket.current.disconnect();
    };
  }, [token, dispatch]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = () => {
    if (message.trim() === "") {
      return; // Prevent sending empty messages
    }

    socket.current.emit("sendMessage", message, contact, user._id);
    setMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevents the default form submission behavior
      sendMessage();
    }
  };

  if (contact == null) {
    return (
      <div className="border border-blue-400 rounded p-1 flex-1 flex flex-col h-full">
        <h2 className="text-xl font-semibold text-red-700">
          NO Contact SELECTED
        </h2>
      </div>
    );
  }

  return (
    <div className="rounded p-1 flex-1 flex flex-col h-full bg-slate-500">
      <div className="flex-1 bg-slate-700 p-4 rounded shadow overflow-y-scroll">
        {list && list.length > 0 ? (
          list.map((msg, index) => (
            <div
              key={index}
              className={`flex mb-2 ${
                msg.sender === user._id ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`p-2 max-w-xs rounded ${
                  msg.sender === user._id
                    ? "bg-green-100 border border-green-200"
                    : "bg-blue-100 border border-blue-200"
                }`}
              >
                <p className="text-black font-semibold">{msg.content}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No messages</p>
        )}
        <div ref={messagesEndRef}></div>
      </div>

      <div className="mt-4 flex">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 p-2 border rounded-l"
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 hover:bg-blue-700 text-white p-2 rounded-r"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
