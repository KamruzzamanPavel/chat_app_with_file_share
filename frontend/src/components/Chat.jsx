import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client";
import {
  addMessage,
  deleteMessage,
  updateMessage,
} from "../store/messageSlice";
import { setNewMessageFlag, updateLastMessage } from "../store/contactsSlice";
import SendButton from "./SendButton";
import moment from "moment";

const Chat = () => {
  const [message, setMessage] = useState(""); // State to hold the message input
  const [editMessage, seteditMessage] = useState(""); // State to hold the edited message input
  const [dropdownIndex, setDropdownIndex] = useState(null); // State to manage dropdown visibility per message
  //.................................................
  const [editIndex, seteditIndex] = useState(null);
  //..................................................
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
      dispatch(
        setNewMessageFlag({
          contactId: message.sender,
          hasNewMessage: true,
        })
      );
      dispatch(
        updateLastMessage({
          contactId: message.sender,
          lastMessage: message.content,
        })
      );
    });

    //listen for edit msg
    socket.current.on("messageUpdated", (updatedMessage) => {
      dispatch(
        updateMessage({
          id: updatedMessage._id,
          newContent: updatedMessage.content,
        })
      );
    });
    //listen for delete msg
    socket.current.on("messageDeleted", (updatedMessage) => {
      dispatch(
        deleteMessage({
          id: updatedMessage._id,
          newContent: "This message was deleted.",
        })
      );
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

  const handleEdit = (editId) => {
    // Emit the message to the server
    if (editMessage.trim() === "") return;
    socket.current.emit("editMessage", editMessage, contact, user._id, editId);
    dispatch(
      updateMessage({
        id: editId,
        newContent: editMessage,
      })
    );
    seteditMessage("");
  };

  const handleDelete = (deleteId) => {
    socket.current.emit(
      "editMessage",
      "delete1998",
      contact,
      user._id,
      deleteId
    );
    dispatch(
      deleteMessage({
        id: deleteId,
        newContent: "This Message Was Deleted.",
      })
    );
  };
  //.............
  const toggleDropdown = (index) => {
    setDropdownIndex(dropdownIndex === index ? null : index);
  };
  //..................
  const toggleEdit = (index) => {
    seteditIndex(editIndex === index ? null : index);
  };
  //..................
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
    <div className=" p-1 flex-1 flex flex-col h-full ">
      {/* Messages container */}
      <div
        className="flex-1  p-4   overflow-y-scroll"
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
                    <span className="bg-slate-600 text-white px-3 py-1 rounded-full">
                      {currentMessageDate}
                    </span>
                  </div>
                )}

                <div
                  className={`flex mb-2 ${
                    msg.sender === user._id ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.edited && <p className="text-blue-700">Edited.</p>}
                  <div
                    className={`capitalize m-2 flex justify-center rounded-full p-3 items-center w-5 h-5 bg-sky-500 text-black border-sky-100 border-1 ${
                      msg.sender === user._id ? "hidden" : ""
                    }`}
                  >
                    {/* Show contact's initial */}
                    {contact.username[0]}
                  </div>
                  <div
                    className={`py-1 flex px-3 rounded-xl ${
                      msg.sender === user._id
                        ? "bg-gray-800 text-white self-end"
                        : "bg-sky-900 text-white border border-sky-700 self-start"
                    }`}
                  >
                    {/* Message content */}
                    {editIndex === index ? (
                      <div className="bg-gray-800 text-white  rounded-md flex items-center space-x-2 self-end">
                        <input
                          type="text"
                          value={editMessage}
                          className="bg-transparent border-none border-gray-500 focus:outline-none flex-1"
                          onChange={(e) => {
                            seteditMessage(e.target.value);
                          }} // Handle the input change
                        />
                        <button
                          className="bg-red-500 text-white font-extrabold px-2 py-1 rounded-full hover:bg-red-600"
                          onClick={() => {
                            toggleEdit();
                            seteditMessage("");
                          }} // Toggle editing mode
                          title="Cancel"
                        >
                          &#215; {/* Close icon */}
                        </button>
                        <button
                          className="bg-green-500 text-white px-2 py-1 rounded-full font-extrabold hover:bg-green-600"
                          onClick={() => {
                            handleEdit(msg._id);
                            toggleEdit();
                          }} // Save changes
                          title="Save"
                        >
                          &#10003; {/* Checkmark icon */}
                        </button>
                      </div>
                    ) : (
                      <p
                        className={`${
                          msg.deleted
                            ? "font-thin italic text-gray-500"
                            : "font-semibold"
                        }`}
                      >
                        {msg.content}
                      </p>
                    )}

                    {/* Dropdown Menu */}
                    {msg.sender === user._id && (
                      <div className="relative ml-2">
                        {!(editIndex === index || msg.deleted) && (
                          <div
                            className="flex items-center cursor-pointer text-lg z-0"
                            onClick={() => toggleDropdown(index)}
                          >
                            ⋮
                          </div>
                        )}
                        {dropdownIndex === index && (
                          <div className="absolute right-0 mt-2 w-24 bg-white border border-gray-300 rounded shadow-md z-10">
                            <div
                              className="px-4 py-2 hover:bg-black text-gray-400 cursor-pointer"
                              onClick={() => {
                                seteditMessage(msg.content);
                                toggleEdit(index);
                                setDropdownIndex(null);
                              }}
                            >
                              Edit
                            </div>
                            <div
                              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600"
                              onClick={() => {
                                handleDelete(msg._id);
                                setDropdownIndex(null);
                              }}
                            >
                              Delete
                            </div>
                          </div>
                        )}
                      </div>
                    )}
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
      <div className=" flex bottom-2 right-2 fixed md:relative  left-2 ">
        <input
          type="text"
          value={message} // Bind input value to state
          onChange={(e) => {
            setMessage(e.target.value); // Update the state on input change
            if (contact && contact._id) {
              dispatch(
                setNewMessageFlag({
                  contactId: contact._id,
                  hasNewMessage: false, // Turn off the flag
                })
              );
            }
          }} // Update state on input change
          onKeyDown={(e) => {
            if (message) {
              dispatch(
                updateLastMessage({
                  contactId: contact._id, // Replace with the actual contact ID
                  lastMessage: "You : " + message, // Replace with the current message content
                })
              );
            }
            handleKeyDown(e);
          }} // Send message on Enter
          className="flex-1 p-2 border border-slate-800 font-semibold focus:outline-none rounded-l bg-black text-white"
          placeholder="Type your message..."
        />
        <button
          onClick={() => {
            sendMessage(); // Send the message
            dispatch(
              updateLastMessage({
                contactId: contact._id, // Replace with the actual contact ID
                lastMessage: "You : " + message, // Replace with the current message content
              })
            );
          }}
          className="bg-sky-600 hover:bg-sky-700 text-white p-2 rounded-r"
        >
          <SendButton />
        </button>
      </div>
    </div>
  );
};

export default Chat;
