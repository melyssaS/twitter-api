const router = require("express").Router;
const route = router();

const Follower = require("../models/follower");
const Request = require("../models/request");

const { validateToken } = require("../config/auth");

route.get("/following", async (req, res) => {
  try {
    const { user_id } = req.query;
    const following = await Follower.find({ following_id: user_id });
    res.status(200).json({ users: following });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message });
  }
});

route.get("/followers", async (req, res) => {
  try {
    const { user_id } = req.query;
    const followers = await Follower.find({ user_id });
    res.status(200).json({ users: followers });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message });
  }
});

route.post("/request", async (req, res) => {
  try {
    const token = req.headers["authorization"].split(" ")[1];
    const id = validateToken(token).id;
    const { user_id } = req.body;

    const isFollowing = await Follower.exists({
      user_id: id,
      following_id: user_id,
    });

    if (isFollowing) {
      return res.status(408).json({
        message: "User is following or have a request",
      });
    }

    const isRequested = await Request.exists({ from_id: id, to_id: user_id });
    if (isRequested) {
      return res.status(405).json({
        message: "User  have a request",
      });
    }

    const userRequest = await Request.create({
      from_id: user_id,
      to_id: id,
      status: "request",
    });

    return res.status(200).json({});
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message });
  }
});

route.post("/response", async (req, res) => {
  try {
    const { request_id, action } = req.body;

    const { from_id, to_id } = await Request.findByIdAndDelete(request_id);

    if (action === "accept") {
      await Follower.create({ user_id: from_id, following_id: to_id });
    }

    return res.status(200).json({});
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message });
  }
});

module.exports = route;
