const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.register = async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 8);
  const user = new User({ username, password: hashedPassword });
  await user.save();
  res.status(201).send({ message: "User registered successfully" });
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).send({ error: "Invalid credentials" });
  }
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
  res.send({ user: user, token: token });
};

exports.logout = (req, res) => {
  const userId = req.user._id.toString();
  // Logic for logging out (as shown in your code)
  res.send({ message: "Logged out successfully" });
};
