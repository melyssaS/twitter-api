const router = require("express").Router;
const User = require("../models/user");
const PostLike = require("../models/post-likes");
const PostSaved = require("../models/post-saved");
const Follower = require("../models/follower");
const Post = require("../models/post");
const { validateToken } = require("../config/auth");
const route = router();

//Solo está permitido si el usuario esta siguiendo al usuario, a menos que sea el usuario mismo

//Endpoint de informacion de publicacion --> Falta
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
    let totalPages = await postsModels.count();
    let pages = Math.ceil(totalPages / recordPerPage);

    let pageNumber = (req.body.page == null || req.body.page > pages) ? 1 : req.body.page;
    let startFrom = (pageNumber - 1) * recordPerPage;

    const posts = await Post.find({})
      .sort({ "id": -1 })
      .skip(startFrom)
      .limit(recordPerPage)
      .toArray();
    res.status(200).json({ posts });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message });
  }
});

//Endpoint de dar me gusta a una publicación
route.post("/like", async (req, res) => {
  try {
    if (req.body.post_id && !await PostLike.findOne({
      post_id: req.body.post_id,
      user_id: req.user.user_id
    })) {
      const save = await PostLike.create({
        post_id: req.body.post_id,
        user_id: req.user.user_id
      });
      res.status(200).json(save)
    } else {
      res.status(404).json({ message: 'Ya está gustado', statusCode: 401 })
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message });
  }
});

//Endpoint de guardar una publicación
route.post("/save", async (req, res) => {
  try {
    if (req.body.post_id && !await PostSaved.findOne({ post_id: mongoose.Types.ObjectId(req.body.post_id), user_id: req.user.user_id })) {
      const save = await PostSaved.create({
        post_id: mongoose.Types.ObjectId(req.body.post_id),
        user_id: req.user.user_id
      });
      res.status(200).json({ posts });
    } else {
      res.status(404).json({ message: 'Not valid', statusCode: 401 })
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message });
  }
});

//Endpoint de crear/subir publicacion && Endpoint de comentar en una publicación
route.post("/", async (req, res) => {
  try {
    if (req.body.post_id && req.body.comment) {
      const comment = await commentModel.create({
        post_id: req.body.post_id,
        comment: req.body.comment,
        user_id: req.user.user_id
      });
      res.status(200).json(comment)
    } else {
      res.status(404).json({ message: 'Not valid', statusCode: 401 })
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message });
  }
});


module.exports = route;
