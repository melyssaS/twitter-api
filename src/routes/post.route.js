const router = require("express").Router;
const User = require("../models/user");
const PostLike = require("../models/post-likes");
const PostSaved = require("../models/post-saved");
const Follower = require("../models/follower");
const Comment = require("../models/comment");
const Post = require("../models/post");
const { validateToken } = require("../config/auth");
const route = router();

//Solo está permitido si el usuario esta siguiendo al usuario, a menos que sea el usuario mismo

//Endpoint de informacion de publicacion --> Falta
route.get("/", async (req, res) => {
  try {
    //the author you want to see posts
    const { post_id } = req.query;
    if (!post_id) {
      return res.status(401).json({ message: "Missing post_id field" });
    }

    const post = await Post.findById(post_id).lean();
    const comments = await Comment.find({ post_id }).lean();
    const likes = await PostLike.count({ post_id });
    const author = await User.findById(
      post.author_id,
      "-birthdate -password"
    ).lean();
    return res.status(200).json({
      ...post,
      author,
      comments,
      likes,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message });
  }
});

//Endpoint de publicaciones que un usuario ha dado "me gusta"
//Solo está permitido si el usuario permite ver sus "me gusta", a menos que sea el usuario mismo
route.get("/liked-by", async (req, res) => {
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

route.get("/saved-by", async (req, res) => {
  try {
    //who sent the request to see likes
    const token = req.headers["authorization"].split(" ")[1];
    const user_id = validateToken(token).id;
    const savedPosts = await PostSaved.find({ user_id }).lean();
    const postsId = savedPosts.map((p) => p.post_id);
    const posts = await Post.find({ _id: { $in: postsId } });
    res.status(200).json({ posts });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message });
  }
});

//Get timeline de un usuario
route.get("/timeline", async (req, res) => {
  try {
    let recordPerPage = 5;
    let pageNumber = !req.body.page ? 1 : req.body.page;
    let startFrom = (pageNumber - 1) * recordPerPage;
    //who sent the request to see likes
    const token = req.headers["authorization"].split(" ")[1];
    const user_id = validateToken(token).id;
    const posts = await Post.find({ author_id: user_id })
      .sort({ id: -1 })
      .skip(startFrom)
      .limit(recordPerPage)
      .lean();
    res.status(200).json({ posts });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message });
  }
});

//Endpoint de dar me gusta a una publicación
route.post("/like", async (req, res) => {
  try {
    const { post_id } = req.body;
    const token = req.headers["authorization"].split(" ")[1];
    const user_id = validateToken(token).id;
    if (post_id) {
      const alreadyExists = await PostLike.exists({
        post_id,
        user_id,
      });
      if (alreadyExists) {
        return res.status(409).json({ message: "Already liked" });
      }
      await PostLike.create({
        post_id,
        user_id,
      });
      res.status(200).json({});
    } else {
      res.status(401).json({ message: "Not Valid" });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message });
  }
});

//Endpoint de guardar una publicación
route.post("/save", async (req, res) => {
  try {
    const { post_id } = req.body;
    const token = req.headers["authorization"].split(" ")[1];
    const user_id = validateToken(token).id;
    if (post_id) {
      const alreadyExists = await PostSaved.exists({
        post_id,
        user_id,
      });
      if (alreadyExists) {
        return res.status(409).json({ message: "Already saved" });
      }
      await PostSaved.create({
        post_id,
        user_id,
      });
      res.status(200).json({});
    } else {
      res.status(401).json({ message: "Not valid" });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message });
  }
});

//Endpoint de crear/subir publicacion && Endpoint de comentar en una publicación
route.post("/", async (req, res) => {
  try {
    const token = req.headers["authorization"].split(" ")[1];
    const user_id = validateToken(token).id;
    if (req.body.post_id && req.body.comment) {
      await Comment.create({
        post_id: req.body.post_id,
        text: req.body.comment,
        author: user_id,
      });
      return res.status(200).json({});
    }
    if (req.body.img_url && req.body.bio && req.body.author) {
      await Post.create({
        author_id: req.body.author,
        img_url: req.body.img_url,
        bio: req.body.bio,
      });
      return res.status(200).json({});
    }
    return res.status(401).json({ message: "Not valid" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message });
  }
});

module.exports = route;
