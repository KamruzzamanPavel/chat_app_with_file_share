const jwt = require("jsonwebtoken");

module.exports = (token, callback) => {
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return callback(err);
    }
    callback(null, decoded);
  });
};
