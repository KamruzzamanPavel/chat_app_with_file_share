import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client";
import { addMessage } from "../store/messageSlice";
import SendButton from "./SendButton";
import moment from "moment";

const Chat = () => {
  const [message, setMessage] = useState(""); // State to hold the message input
  const { list } = useSelector((state) => state.messages); // Redux state for messages
  const { user, contact, token } = useSelector((state) => state.auth); // Redux state for user, contact, and token
  const dispatch = useDispatch(); // Redux dispatch function
  const messagesEndRef = useRef(null); // Ref to scroll to the bottom
  const socket = useRef(null); // Socket instance ref

  useEffect(() => {
    // Initialize socket connection
    socket.current = io("http://localhost:5000", {
      query: { token }, // Pass token as query
    });

    // Listen for new messages
    socket.current.on("receiveMessage", (message) => {
      dispatch(addMessage(message)); // Dispatch new message to Redux
    });

    return () => {
      // Cleanup socket on component unmount
      socket.current.disconnect();
    };
  }, [token, dispatch]);

  useEffect(() => {
    // Scroll to the bottom whenever the message list changes
    scrollToBottom();
  }, [list]);

  const scrollToBottom = () => {
    // Scroll to the last message
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = () => {
    if (message.trim() === "") {
      return; // Prevent sending empty messages
    }

    // Emit the message to the server
    socket.current.emit("sendMessage", message, contact, user._id);
    setMessage(""); // Clear the message input
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent default form submission
      sendMessage(); // Send message on Enter key press
    }
  };

  if (contact == null) {
    // Show a placeholder if no contact is selected
    return (
      <div className="border border-blue-400 rounded p-1 flex-1 flex flex-col h-full">
        <h2 className="text-xl font-semibold text-red-700">
          NO Contact SELECTED
        </h2>
      </div>
    );
  }

  return (
    <div className="rounded p-1 flex-1 flex flex-col h-full bg-slate-600">
      {/* Messages container */}
      <div
        className="flex-1 bg-slate-700 p-4 rounded shadow overflow-y-scroll"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(155, 155, 155, 0.5) transparent",
        }}
      >
        {list && list.length > 0 ? (
          list.map((msg, index) => {
            const currentMessageDate = moment(msg.timestamp).format(
              "MMMM Do YYYY"
            ); // Format the message timestamp
            const previousMessageDate =
              index > 0
                ? moment(list[index - 1].timestamp).format("MMMM Do YYYY")
                : null;

            return (
              <div key={index}>
                {currentMessageDate !== previousMessageDate && (
                  // Date separator for messages
                  <div className="text-center my-4">
                    <span className="bg-slate-500 text-white px-3 py-1 rounded-full">
                      {currentMessageDate}
                    </span>
                  </div>
                )}

                <div
                  className={`flex mb-2 ${
                    msg.sender === user._id ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`capitalize m-2 flex justify-center rounded-full p-3 items-center w-5 h-5 bg-sky-500 text-black border-sky-100 border-1 ${
                      msg.sender === user._id ? "hidden" : ""
                    }`}
                  >
                    {/* Show contact's initial */}
                    {contact.username[0]}
                  </div>
                  <div
                    className={`py-1 px-3 rounded-xl ${
                      msg.sender === user._id
                        ? "bg-gray-800 text-white self-end"
                        : "bg-sky-900 text-white border border-sky-700 self-start"
                    }`}
                  >
                    {/* Message content */}
                    <p className="font-semibold">{msg.content}</p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          // No messages placeholder
          <p className="text-center text-gray-500">No messages</p>
        )}
        {/* Reference for scrolling */}
        <div ref={messagesEndRef}></div>
      </div>

      {/* Input field and send button */}
      <div className="mt-4 flex">
        <input
          type="text"
          value={message} // Bind input value to state
          onChange={(e) => setMessage(e.target.value)} // Update state on input change
          onKeyDown={handleKeyDown} // Send message on Enter
          className="flex-1 p-2 border border-slate-800 font-semibold focus:outline-none rounded-l bg-black text-white"
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage} // Send message on click
          className="bg-sky-600 hover:bg-sky-700 text-white p-2 rounded-r"
        >
          <SendButton />
        </button>
      </div>
    </div>
  );
};

export default Chat;
