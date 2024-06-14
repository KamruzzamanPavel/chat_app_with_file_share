// server/index.js
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cors = require("cors");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", withCredentials: true }));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
mongoose.connect(process.env.MONGO_URI);

const User = require("./models/User");
const Message = require("./models/Message");
const { Socket } = require("net");

// Authentication Middleware
const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization").replace("Bearer ", "");
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("Unauthorized");
      return res.status(401).send({ error: "Unauthorized" });
    }
    console.log("authorized");
    req.user = decoded;
    next();
  });
};

// Register
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 8);
  const user = new User({ username, password: hashedPassword });
  await user.save();
  res.status(201).send({ message: "User registered successfully" });
});

// Login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).send({ error: "Invalid credentials" });
  }
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
  res.send({ user: user, token: token });
});

// Send Message
app.post("/messages", authMiddleware, async (req, res) => {
  const { content } = req.body;
  try {
    const newMessage = new Message({
      content,
      sender: req.user._id, // Assuming req.user is set by authMiddleware
    });
    await newMessage.save();
    io.emit("receiveMessage", newMessage); // Emit message to all clients
    res.status(201).send({ message: "Message sent successfully" });
  } catch (error) {
    res.status(500).send({ error: "Error sending message" });
  }
});

// Fetch Messages
app.get("/messages", authMiddleware, async (req, res) => {
  try {
    const messages = await Message.find().populate("sender", "username"); // Populate sender field with username
    res.send(messages);
  } catch (error) {
    res.status(500).send({ error: "Error fetching messages" });
  }
});

// Socket.io connection
io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("setUser", () => {});

  socket.on("sendMessage", async (message, user) => {
    try {
      const newMessage = new Message({
        content: message,
        sender: user._id, // Assuming socket.user is set when client connects
      });
      await newMessage.save();
      io.emit("receiveMessage", newMessage); // Emit message to all clients
    } catch (error) {
      console.error("Error saving message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
