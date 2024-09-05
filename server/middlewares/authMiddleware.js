const jwt = require("jsonwebtoken");

exports.authMiddleware = (req, res, next) => {
  const token = req.header("Authorization").replace("Bearer ", "");
  const contact = { _id: req.header("Receiver") };
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ error: "Unauthorized" });
    }
    req.user = decoded;
    req.contact = contact;
    next();
  });
};
