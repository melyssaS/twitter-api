const jwt = require("jsonwebtoken");

const createToken = (
  data // create token
) => jwt.sign(data, process.env.TOKEN_SECRET, { expiresIn: "2h" });

const validateToken = (token) => jwt.verify(token, process.env.TOKEN_SECRET);

module.exports = {
  createToken,
  validateToken,
};
