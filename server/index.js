const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = require("./socket")(server);

app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", withCredentials: true }));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("database connected");
});

app.use("/", require("./routes/authRoutes"));
app.use("/messages", require("./routes/messageRoutes"));
app.use("/users", require("./routes/userRoutes"));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
