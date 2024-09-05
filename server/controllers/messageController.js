const Message = require("../models/Message");

exports.fetchMessages = async (req, res) => {
  try {
    const { user, contact } = req;
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
};
