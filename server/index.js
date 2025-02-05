const express = require("express");
const path = require("path");
const multer = require("multer");
const http = require("http");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const { authMiddleware } = require("./middlewares/authMiddleware");
const getIPAddress = require("./machineIP");
const machineIP = getIPAddress();
const app = express();
const server = http.createServer(app);
const io = require("./socket")(server);

app.use(express.json());
app.use(cors({ origin: `http://${machineIP}:5173`, withCredentials: true }));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", `http://${machineIP}:5173`);
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Set the upload folder
  },
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}`);
  },
});

const upload = multer({ storage });
// Serve static files from the uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
//.......................
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    res
      .status(200)
      .json({ message: "File uploaded successfully", file: req.file });
  } catch (error) {
    res.status(500).json({ error: "Failed to upload file" });
  }
});
mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("database connected");
});

app.use("/", require("./routes/authRoutes"));
app.use("/messages", require("./routes/messageRoutes"));
app.use("/users", require("./routes/userRoutes"));
//.........................................................
const PORT = process.env.PORT || 5000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port http://${machineIP}:${PORT}`);
});
