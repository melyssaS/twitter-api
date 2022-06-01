const router = require("express").Router;
const User = require("../models/user");
const PostLike = require("../models/post-likes");
const Post = require("../models/post");
const Follower = require("../models/follower");
const bcrypt = require("bcrypt");
const { createToken, validateToken } = require("../config/auth");

const comparePasswords = (pw, hash) => {
  return bcrypt.compare(pw, hash);
};

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
      username: user.username,
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

//user info
//Response: { username, email, bio, liked_count, posts_count, followers_count, followed_count }
route.get("/", async (req, res) => {
  try {
    const { user_id } = req.query;
    if (!user_id) {
      return res.status(401).json({ message: "user_id is missing" });
    }
    //exlude Contraseña y fecha de cumpleaños
    const user = await User.findById(user_id, "-password -birthdate").lean();
    if (Object.keys(user).length === 0) {
      return res.status(404).json({ message: "User does not exists" });
    }
    //Debe incluir el numero de publicaciones que el usuario ha dado me gusta, calculado on-demand
    const likedPosts = await PostLike.count({ author_id: user_id });
    //Debe incluir el numero de publicaciones que el usuario ha subido, calculado on-demand
    const postCounts = await Post.count({ author_id: user_id });
    //Debe incluir el numero de seguidores del usuario, calculado on-demand
    const followers = await Follower.count({ following_id: user_id });
    //Debe incluir el numero de seguidos del usuario, calculado on-demand
    const following = await Follower.count({ user_id });
    res.status(200).json({
      ...user,
      liked_count: likedPosts,
      posts_count: postCounts,
      followers_count: followers,
      followed_count: following,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message });
  }
});

module.exports = route;
