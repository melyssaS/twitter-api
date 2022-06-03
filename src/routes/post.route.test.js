const mongoose = require("mongoose");
const User = require("../models/user");
const Post = require("../models/post");
const PostLike = require("../models/post-likes");
const PostSaved = require("../models/post-saved");
const Follower = require("../models/follower");
const Comment = require("../models/comment");
const request = require("supertest");
const app = require("../index");

describe("Post Endpoint", () => {
  beforeAll(async () => {
    await mongoose.connect(global.__MONGO_URI__);
  });
  afterAll(async () => {
    await mongoose.disconnect();
  });
  describe("Post Info", () => {
    let token;
    let userId;
    let postId;
    const payload = {
      username: "Test",
      password: "A",
      email: "a@a.com",
      birthdate: new Date(2000, 3, 23),
      bio: "Hola",
    };
    beforeAll(async () => {
      const res = await request(app).post("/users").send(payload);
      const { _id } = await User.findOne({
        username: payload.username,
      }).lean();
      userId = _id.toString();
      //save login token
      token = res.body.token;
      const post1 = await Post.create({
        author_id: userId,
        img_url: "",
        bio: "Post1",
      });
      postId = post1._id.toString();
      //create 3 likes
      await PostLike.create({
        user_id: userId,
        post_id: post1._id.toString(),
      });
      await PostLike.create({
        user_id: "2",
        post_id: post1._id.toString(),
      });
      await PostLike.create({
        user_id: "3",
        post_id: post1._id.toString(),
      });
      await Comment.create({
        author: userId,
        post_id: post1._id.toString(),
        text: "Hola",
      });
    });
    afterAll(async () => {
      await Post.deleteMany({});
      await PostLike.deleteMany({});
      await Comment.deleteMany({});
      await User.deleteMany({});
    });
    it("Post Info", async () => {
      const res = await request(app)
        .get("/posts")
        .query({ post_id: postId })
        .auth(token, { type: "bearer" });
      expect(res.statusCode).toEqual(200);
      expect(res.body.bio).toEqual("Post1");
      expect(res.body.likes).toEqual(3);
      expect(res.body.comments.length).toEqual(1);
      expect(res.body.author.username).toEqual(payload.username);
      expect(res.body.author.email).toEqual(payload.email);
    });
  });
  describe("Liked And Saved Posts", () => {
    let token;
    let userId;
    const payload = {
      username: "Test",
      password: "A",
      email: "a@a.com",
      birthdate: new Date(2000, 3, 23),
      bio: "Hola",
    };
    beforeAll(async () => {
      const res = await request(app).post("/users").send(payload);

      const { _id } = await User.findOne({
        username: payload.username,
      }).lean();
      userId = _id.toString();
      //save login token
      token = res.body.token;
      const post1 = await Post.create({
        author_id: userId,
        img_url: "",
        bio: "Post1",
      });
      //create a post
      await PostLike.create({
        user_id: userId,
        post_id: post1._id.toString(),
      });
      const post2 = await Post.create({
        author_id: userId,
        img_url: "",
        bio: "Post2",
      });
      //save 2 posts
      await PostSaved.create({
        user_id: userId,
        post_id: post1._id.toString(),
      });
      await PostSaved.create({
        user_id: userId,
        post_id: post2._id.toString(),
      });
    });
    afterAll(async () => {
      await User.deleteMany();
      await Post.deleteMany();
      await PostLike.deleteMany();
      await PostSaved.deleteMany();
      await Comment.deleteMany();
      await Follower.deleteMany();
    });
    it("Publicaciones gustadas por un usuario", async () => {
      const res = await request(app)
        .get("/posts/liked-by")
        .query({ user_id: userId })
        .auth(token, { type: "bearer" });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("posts");
      expect(res.body.posts.length).toEqual(1);
      expect(res.body.posts[0].bio).toEqual("Post1");
    });
    it("Publicaciones guardadas por un usuario", async () => {
      const res = await request(app)
        .get("/posts/saved-by")
        .auth(token, { type: "bearer" });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("posts");
      expect(res.body.posts.length).toEqual(2);
      expect(res.body.posts.map((p) => p.bio)).toEqual(["Post1", "Post2"]);
    });
    it("Dar me gusta a publicacion", async () => {
      const { _id: post_id } = await Post.create({
        bio: "Post3",
        author_id: userId,
        img_url: "",
      });
      let like = await PostLike.exists({ post_id, user_id: userId });
      expect(like).toBe(null);
      const res = await request(app)
        .post("/posts/like")
        .send({ post_id })
        .auth(token, { type: "bearer" });
      expect(res.statusCode).toEqual(200);
      like = await PostLike.exists({ post_id, user_id: userId });
      expect(like).toBeDefined();
    });
    it("Guardar publicacion", async () => {
      const { _id: post_id } = await Post.create({
        bio: "Post4",
        author_id: userId,
        img_url: "",
      });
      let saved = await PostSaved.exists({ post_id, user_id: userId });
      expect(saved).toBe(null);
      const res = await request(app)
        .post("/posts/save")
        .send({ post_id })
        .auth(token, { type: "bearer" });
      expect(res.statusCode).toEqual(200);
      saved = await PostSaved.exists({ post_id, user_id: userId });
      expect(saved).toBeDefined();
    });
    it("Comentar publicacion", async () => {
      const { _id: post_id } = await Post.create({
        bio: "PostWithComments",
        author_id: userId,
        img_url: "",
      });
      let postComment = await Comment.exists({ post_id, user_id: userId });
      expect(postComment).toBe(null);
      const res = await request(app)
        .post("/posts")
        .send({ post_id, comment: "Ola k ace" })
        .auth(token, { type: "bearer" });
      expect(res.statusCode).toEqual(200);
      postComment = await Comment.exists({ post_id, user_id: userId });
      expect(postComment).toBeDefined();
    });
    it("Comentarios de una publicacion", async () => {});
  });
});
