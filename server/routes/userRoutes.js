const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware").authMiddleware;

router.get("/", authMiddleware, userController.getUsers);

module.exports = router;
