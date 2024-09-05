const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");
const authMiddleware = require("../middlewares/authMiddleware").authMiddleware;

router.get("/", authMiddleware, messageController.fetchMessages);

module.exports = router;
