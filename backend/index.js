// server/index.js
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Message = require("./models/Message");
const cors = require("cors");
require("dotenv").config();

//.............................................................................
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const socketIdToUserId = new Map();
app.use(express.json());

//cors.....................................................................
app.use(cors({ origin: "http://localhost:5173", withCredentials: true }));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

mongoose.connect(process.env.MONGO_URI);

// token verification in io.....................................
const verifyToken = (token, callback) => {
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("Unauthorized");
      return callback(err);
    }
    callback(null, decoded);
  });
};

// Authentication Middleware.......................................
const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization").replace("Bearer ", "");
  const contact = { _id: req.header("Receiver") };
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("Unauthorized");
      return res.status(401).send({ error: "Unauthorized" });
    }
    // console.log("authorized");
    req.user = decoded;
    req.contact = contact;
    next();
  });
};

// Register..........................................................
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 8);
  const user = new User({ username, password: hashedPassword });
  await user.save();
  res.status(201).send({ message: "User registered successfully" });
});

// Login............................................
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).send({ error: "Invalid credentials" });
  }
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
  res.send({ user: user, token: token });
});

//Get Users.............................................
app.get("/users", authMiddleware, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

//  Send Message ................NOT USED...............................
// app.post("/messages", authMiddleware, async (req, res) => {});

// Fetch Messages......................................
app.get("/messages", authMiddleware, async (req, res) => {
  try {
    // const messages = await Message.find().populate("sender", "username"); // Populate sender field with username
    // const messages = await Message.find();
    //
    const { user, contact } = req; // Extract user and contact from the request object
    const messages = await Message.find({
      $or: [
        { sender: user._id, receiver: contact._id },
        { sender: contact._id, receiver: user._id },
      ],
    });
    res.send(messages);
  } catch (error) {
    res.status(500).send({ error: "Error fetching messages" });
  }
});

//io with auth...........................................................
io.on("connection", (socket) => {
  const token = socket.handshake.query.token;
  if (!token) {
    return socket.disconnect(true);
  }

  verifyToken(token, (err, decoded) => {
    if (err) {
      return socket.disconnect(true);
    }

    socket.user = decoded; // Store the user data in the socket instance
    // console.log(decoded);
    // Store socket ID to user ID mapping
    if (socket.user && socket.user._id) {
      socketIdToUserId.set(socket.id, socket.user._id.toString());
    }
    console.log(socketIdToUserId);

    socket.on("sendMessage", async (message, contact, sender) => {
      try {
        const newMessage = new Message({
          content: message,
          sender: sender, // Assuming socket.user is set by authentication
          receiver: contact._id, // Add a status field to mark the message as pending
        });

        await newMessage.save();

        const contactSocketId = Array.from(socketIdToUserId.entries()).filter(
          ([id, userId]) => userId === contact._id
        );
        console.log(contactSocketId);
        const senderSocketId = Array.from(socketIdToUserId.entries()).filter(
          ([id, userId]) => userId === sender
        );
        //..........................
        console.log(senderSocketId);
        if (contactSocketId) {
          contactSocketId.map((contactSocketId) => {
            io.to(contactSocketId[0]).emit("receiveMessage", newMessage);
          });

          senderSocketId.map((senderSocketId) => {
            io.to(senderSocketId[0]).emit("receiveMessage", newMessage);
          });
          // Update message status to 'sent' or remove from pending (depending on your logic)

          // await newMessage.save();
        } else {
          senderSocketId.map((senderSocketId) => {
            io.to(senderSocketId[0]).emit("receiveMessage", newMessage);
          });
          console.log(`Contact ${contact._id} is not online `);
          // Handle pending message logic (optional)
        }
      } catch (error) {
        console.error("Error saving or sending message:", error);
        // Handle pending message logic (optional)
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
