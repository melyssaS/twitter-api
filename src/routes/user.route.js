const router = require("express").Router;
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const comparePasswords = (pw, hash) => {
  return bcrypt.compare(pw, hash);
};

const createToken = (
  data // create token
) => jwt.sign(data, process.env.TOKEN_SECRET, { expiresIn: "2h" });

const validateToken = (token) => jwt.verify(token, process.env.TOKEN_SECRET);

const validateUserPayload = (data) =>
  ["username", "password", "email", "birthdate", "bio"].every((key) =>
    data.hasOwnProperty(key)
  );

const route = router();

//register
route.post("/", async (req, res) => {
  try {
    //{ username, password, email, birthdate, bio }
    const validInfo = validateUserPayload(req.body);
    if (!validInfo) {
      return res
        .status(401)
        .json({ message: "One or more fields are missing" });
    }
    const user = await User.create(req.body);
    const token = createToken({
      name: user.name,
      id: user._id,
    });
    res.status(200).json({
      token,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message });
  }
});

//login, both jwt and user/pw
route.post("/login", async (req, res) => {
  try {
    const { username, password, token } = req.body;
    if (token) {
      const verified = validateToken(token);
      if (verified) {
        return res.status(200).json({});
      } else {
        // Access Denied
        return res.status(401).json({ message: "Unauthorized" });
      }
    } else {
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(404).json({ message: `User ${username} not found` });
      }
      const passwordMatch = await comparePasswords(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: "Password does not match" });
      }
      const token = createToken({
        name: user.name,
        id: user._id,
      });
      res.status(200).json({ token });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message });
  }
});

module.exports = route;
