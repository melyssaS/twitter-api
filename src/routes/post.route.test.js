const mongoose = require("mongoose");
const User = require("../models/user");
const Post = require("../models/post");
const PostLike = require("../models/post-likes");
const PostSaved = require("../models/post-saved");
const Follower = require("../models/follower");
const request = require("supertest");
const app = require("../index");

describe("Post Endpoint", () => {
  beforeAll(async () => {
    await mongoose.connect(global.__MONGO_URI__);
  });
  afterAll(async () => {
    await mongoose.disconnect();
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
    it("Should Comentar publicacion", async () => {});

    it("Should Mostrar Comentarios de una publicacion", async () => {});
  });
});
