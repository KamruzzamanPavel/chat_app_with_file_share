// import { useState, useEffect, useRef } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import io from "socket.io-client";
// import { addMessage } from "../store/messageSlice";
// import SendButton from "./SendButton";

// const Chat = () => {
//   const [message, setMessage] = useState("");
//   const { list } = useSelector((state) => state.messages);
//   const { user, contact, token } = useSelector((state) => state.auth);
//   const dispatch = useDispatch();
//   const messagesEndRef = useRef(null);
//   const socket = useRef(null);

//   useEffect(() => {
//     socket.current = io("http://localhost:5000", {
//       query: { token },
//     });

//     socket.current.on("receiveMessage", (message) => {
//       dispatch(addMessage(message));
//       scrollToBottom();
//     });

//     return () => {
//       socket.current.disconnect();
//     };
//   }, [token, dispatch]);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   const sendMessage = () => {
//     if (message.trim() === "") {
//       return; // Prevent sending empty messages
//     }

//     socket.current.emit("sendMessage", message, contact, user._id);
//     setMessage("");
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter") {
//       e.preventDefault(); // Prevents the default form submission behavior
//       sendMessage();
//     }
//   };

//   if (contact == null) {
//     return (
//       <div className="border border-blue-400 rounded p-1 flex-1 flex flex-col h-full">
//         <h2 className="text-xl font-semibold text-red-700">
//           NO Contact SELECTED
//         </h2>
//       </div>
//     );
//   }

//   return (
//     <div className="rounded p-1 flex-1 flex flex-col h-full bg-slate-600">
//       <div
//         className="flex-1 bg-slate-700 p-4 rounded shadow overflow-y-scroll"
//         style={{
//           scrollbarWidth: "thin",
//           scrollbarColor: "rgba(155, 155, 155, 0.5) transparent",
//         }}
//       >
//         {list && list.length > 0 ? (
//           list.map((msg, index) => (
//             <div
//               key={index}
//               className={`flex mb-2 ${
//                 msg.sender === user._id ? "justify-end" : "justify-start"
//               }`}
//             >
//               <div
//                 className={`capitalize m-2 flex justify-center rounded-full p-3 items-center w-5 h-5 bg-sky-500 text-black border-sky-100 border-1 ${
//                   msg.sender === user._id ? "hidden" : ""
//                 }`}
//               >
//                 {contact.username[0]}
//               </div>
//               <div
//                 className={`py-1 px-3   rounded-xl ${
//                   msg.sender === user._id
//                     ? "bg-gray-800 text-white self-end"
//                     : "bg-sky-900 text-white  border border-sky-700 self-start"
//                 }`}
//               >
//                 <p className="font-semibold">{msg.content}</p>
//               </div>
//             </div>
//           ))
//         ) : (
//           <p className="text-center text-gray-500">No messages</p>
//         )}
//         <div ref={messagesEndRef}></div>
//       </div>

//       <div className="mt-4 flex">
//         <input
//           type="text"
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           onKeyDown={handleKeyDown}
//           className="flex-1 p-2 border border-slate-800 font-semibold focus:outline-none rounded-l bg-black text-white"
//           placeholder="Type your message..."
//         />
//         <button
//           onClick={sendMessage}
//           className="bg-sky-600 hover:bg-sky-700 text-white p-2 rounded-r"
//         >
//           <SendButton />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Chat;
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client";
import { addMessage } from "../store/messageSlice";
import SendButton from "./SendButton";
import moment from "moment";

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
    <div className="rounded p-1 flex-1 flex flex-col h-full bg-slate-600">
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
            );
            const previousMessageDate =
              index > 0
                ? moment(list[index - 1].timestamp).format("MMMM Do YYYY")
                : null;

            return (
              <div key={index}>
                {currentMessageDate !== previousMessageDate && (
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
                    {contact.username[0]}
                  </div>
                  <div
                    className={`py-1 px-3 rounded-xl ${
                      msg.sender === user._id
                        ? "bg-gray-800 text-white self-end"
                        : "bg-sky-900 text-white border border-sky-700 self-start"
                    }`}
                  >
                    <p className="font-semibold">{msg.content}</p>
                  </div>
                </div>
              </div>
            );
          })
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
          className="flex-1 p-2 border border-slate-800 font-semibold focus:outline-none rounded-l bg-black text-white"
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          className="bg-sky-600 hover:bg-sky-700 text-white p-2 rounded-r"
        >
          <SendButton />
        </button>
      </div>
    </div>
  );
};

export default Chat;
