const socketIo = require("socket.io");
const verifyToken = require("./utils/verifyToken");
const Message = require("./models/Message");

const socketIdToUserId = new Map();

module.exports = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    const token = socket.handshake.query.token;
    if (!token) {
      return socket.disconnect(true);
    }

    verifyToken(token, (err, decoded) => {
      if (err) {
        return socket.disconnect(true);
      }

      socket.user = decoded;
      socketIdToUserId.set(socket.id, socket.user._id.toString());

      const activeUsers = Array.from(
        new Set(Array.from(socketIdToUserId.values()))
      );
      io.emit("activeUsers", activeUsers);

      socket.on("sendMessage", async (message, contact, sender) => {
        try {
          const newMessage = new Message({
            content: message,
            sender: sender,
            receiver: contact._id,
          });

          await newMessage.save();

          const contactSocketId = Array.from(socketIdToUserId.entries()).filter(
            ([id, userId]) => userId === contact._id
          );

          contactSocketId.forEach(([contactSocketId]) => {
            io.to(contactSocketId).emit("receiveMessage", newMessage);
          });

          io.to(socket.id).emit("receiveMessage", newMessage);
        } catch (error) {
          console.error("Error saving or sending message:", error);
        }
      });

      socket.on("disconnect", () => {
        socketIdToUserId.delete(socket.id);
        const activeUsers = Array.from(
          new Set(Array.from(socketIdToUserId.values()))
        );
        io.emit("activeUsers", activeUsers);
        console.log(activeUsers);
      });
    });
  });
};
