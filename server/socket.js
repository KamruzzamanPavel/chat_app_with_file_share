const socketIo = require("socket.io");
const verifyToken = require("./utils/verifyToken");
const Message = require("./models/Message");
const fs = require("fs");
const path = require("path");
const getIPAddress = require("./machineIP");
const machineIP = getIPAddress();
// A Map to store socket IDs and corresponding user IDs

const socketIdToUserId = new Map();

module.exports = (server) => {
  // Initialize Socket.io with CORS settings
  const io = socketIo(server, {
    cors: {
      origin: `http://${machineIP}:5173`, // Allow this origin
      methods: ["GET", "POST"], // Allow these HTTP methods
    },
  });

  // Handle new socket connections
  io.on("connection", (socket) => {
    const token = socket.handshake.query.token; // Retrieve the token from the query
    if (!token) {
      return socket.disconnect(true); // Disconnect the client if no token is provided
    }

    // Verify the token
    verifyToken(token, (err, decoded) => {
      if (err) {
        return socket.disconnect(true); // Disconnect the client if the token is invalid
      }

      // Save the decoded user info in the socket object
      socket.user = decoded;

      // Map the socket ID to the user ID
      socketIdToUserId.set(socket.id, socket.user._id.toString());

      // Get the list of active users
      const activeUsers = Array.from(
        new Set(Array.from(socketIdToUserId.values())) // Ensure unique user IDs
      );

      // Broadcast the list of active users to all connected clients
      io.emit("activeUsers", activeUsers);

      // Listen for the "sendMessage" event
      socket.on("sendMessage", async (message, filePath, contact, sender) => {
        console.log("sendMessage");

        try {
          // Create a new message instance
          const newMessage = new Message({
            content: message, // Message content
            sender: sender, // Sender ID
            receiver: contact._id, // Receiver ID
            filePath: filePath,
          });

          // Save the message to the database
          await newMessage.save();

          // Find the socket IDs of the contact (receiver)
          const contactSocketId = Array.from(socketIdToUserId.entries()).filter(
            ([id, userId]) => userId === contact._id
          );

          // Send the message to each of the contact's sockets
          contactSocketId.forEach(([contactSocketId]) => {
            io.to(contactSocketId).emit("receiveMessage", newMessage);
          });

          // Also send the message back to the sender
          io.to(socket.id).emit("receiveMessage", newMessage);
        } catch (error) {
          console.error("Error saving or sending message:", error);
        }
      });

      // Listen for the "editMessage" event
      socket.on("editMessage", async (message, contact, sender, messageId) => {
        const existingMessage = await Message.findById(messageId);

        try {
          // Find the socket IDs of the contact (receiver)
          const contactSocketId = Array.from(socketIdToUserId.entries()).filter(
            ([id, userId]) => userId === contact._id
          );

          if (message === "delete1998") {
            if (existingMessage.filePath) {
              const filePath = path.join(
                __dirname,
                "uploads",
                existingMessage.filePath
              );

              // Check if file exists before trying to delete
              if (fs.existsSync(filePath)) {
                fs.unlink(filePath, (err) => {
                  if (err) console.error("Error deleting file:", err);
                  else console.log("File deleted successfully:", filePath);
                });
              }
            }

            const updatedMessage = await Message.findByIdAndUpdate(
              messageId,
              {
                content: "This message was deleted.",
                filePath: "",
                edited: false,
                deleted: true,
              }, // Update both content and edited flag
              { new: true } // Return the updated document
            );
            // Notify the receiver and sender about the updated message
            contactSocketId.forEach(([receiverSocketId]) => {
              io.to(receiverSocketId).emit("messageDeleted", updatedMessage);
            });
            if (!updatedMessage) {
              return console.error("Message not found");
            }
          } else {
            const updatedMessage = await Message.findByIdAndUpdate(
              messageId,
              { content: message, edited: true }, // Update both content and edited flag
              { new: true } // Return the updated document
            );
            // Notify the receiver and sender about the updated message
            contactSocketId.forEach(([receiverSocketId]) => {
              io.to(receiverSocketId).emit("messageUpdated", updatedMessage);
            });
            if (!updatedMessage) {
              return console.error("Message not found");
            }
          }
        } catch (error) {
          console.error("Error editing message:", error);
        }
      });
      // Handle disconnection events
      socket.on("disconnect", () => {
        // Remove the socket ID from the map
        socketIdToUserId.delete(socket.id);

        // Update the list of active users
        const activeUsers = Array.from(
          new Set(Array.from(socketIdToUserId.values()))
        );

        // Broadcast the updated list of active users
        io.emit("activeUsers", activeUsers);

        console.log(activeUsers); // Log the active users
      });
    });
  });
};
