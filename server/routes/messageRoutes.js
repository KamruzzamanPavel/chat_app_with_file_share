const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");
const authMiddleware = require("../middlewares/authMiddleware").authMiddleware;

// Route to fetch messages
router.get("/", authMiddleware, messageController.fetchMessages);
// Route to edit a message
router.put("/messages/:id", messageController.editMessage);

module.exports = router;
