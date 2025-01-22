const Message = require("../models/Message");

// Fetch messages between two users
exports.fetchMessages = async (req, res) => {
  try {
    const { user, contact } = req; // Assume these are populated via middleware
    const messages = await Message.find({
      $or: [
        { sender: user._id, receiver: contact._id },
        { sender: contact._id, receiver: user._id },
      ],
    });
    res.status(200).send(messages);
  } catch (error) {
    res.status(500).send({ error: "Error fetching messages" });
  }
};

// Edit a message
exports.editMessage = async (req, res) => {
  const { id } = req.params; // Message ID
  const { content } = req.body; // Updated content

  try {
    const message = await Message.findByIdAndUpdate(
      id,
      { content },
      { new: true } // Return the updated message
    );

    if (!message) {
      return res.status(404).send({ error: "Message not found" });
    }

    res.status(200).json(message); // Return the updated message
  } catch (error) {
    res.status(500).send({ error: "Error updating message" });
  }
};

// Delete a message
exports.deleteMessage = async (req, res) => {
  const { id } = req.params; // Message ID

  try {
    const message = await Message.findByIdAndDelete(id);

    if (!message) {
      return res.status(404).send({ error: "Message not found" });
    }

    res.status(200).send({ message: "Message deleted successfully" });
  } catch (error) {
    res.status(500).send({ error: "Error deleting message" });
  }
};
