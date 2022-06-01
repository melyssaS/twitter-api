const router = require("express").Router;
const User = require("../models/user");
const PostLike = require("../models/post-likes");
const Follower = require("../models/follower");
const Post = require("../models/post");
const { validateToken } = require("../config/auth");
const route = router();

//Solo está permitido si el usuario esta siguiendo al usuario, a menos que sea el usuario mismo
route.get("/", async (req, res) => {
  try {
    //the author you want to see posts
    const { author } = req.query;
    if (!author) {
      return res.status(401).json({ message: "Missing author field" });
    }
    const token = req.headers["authorization"].split(" ")[1];
    const user_id = validateToken(token).id;

    //find if user is following the author
    const isFollowing = await Follower.exists({
      user_id,
      following_id: author,
    });
    //if its not my own posts or im not following the person
    if (author !== user_id && !isFollowing) {
      return res.status(401).json({
        message:
          "User is not post's owner or is not following the post's author",
      });
    }
    const posts = await Post.find({ author_id: author }).lean();
    return res.status(200).json(posts);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message });
  }
});

//Endpoint de publicaciones que un usuario ha dado "me gusta"
//Solo está permitido si el usuario permite ver sus "me gusta", a menos que sea el usuario mismo
route.post("/liked-by", async (req, res) => {
  try {
    const { user_id } = req.query;
    if (!user_id) {
      return res.status(401).json({ message: "Missing user_id field" });
    }
    //who sent the request to see likes
    const token = req.headers["authorization"].split(" ")[1];
    const sender_id = validateToken(token).id;
    //find if sender_id is following the user_id
    const isFollowing = await Follower.exists({
      user_id: sender_id,
      following_id: user_id,
    });
    //if its not my own likes or im not following the person
    if (user_id !== sender_id && !isFollowing) {
      return res.status(401).json({
        message: "User is not me or user does not allow to see likes",
      });
    }
    //get the posts the user_id has liked
    const postLikes = await PostLike.find({ author_id: user_id }).lean();
    const postsId = postLikes.map((p) => p.post_id);
    const posts = await Post.find({ _id: { $in: postsId } });
    res.status(200).json({ posts });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message });
  }
});

module.exports = route;
