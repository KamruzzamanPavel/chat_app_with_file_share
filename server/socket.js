const socketIo = require("socket.io");
const verifyToken = require("./utils/verifyToken");
const Message = require("./models/Message");

// A Map to store socket IDs and corresponding user IDs
const socketIdToUserId = new Map();

module.exports = (server) => {
  // Initialize Socket.io with CORS settings
  const io = socketIo(server, {
    cors: {
      origin: "http://localhost:5173", // Allow this origin
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
      socket.on("sendMessage", async (message, contact, sender) => {
        try {
          // Create a new message instance
          const newMessage = new Message({
            content: message, // Message content
            sender: sender, // Sender ID
            receiver: contact._id, // Receiver ID
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
