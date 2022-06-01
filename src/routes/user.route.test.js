const mongoose = require("mongoose");
const User = require("../models/user");
const Post = require("../models/post");
const PostLike = require("../models/post-likes");
const Follower = require("../models/follower");
const request = require("supertest");
const app = require("../index");

describe("User Endpoint", () => {
  beforeAll(async () => {
    await mongoose.connect(global.__MONGO_URI__);
  });
  afterAll(async () => {
    await mongoose.disconnect();
  });
  describe("Register", () => {
    //Delete everything after each test
    afterEach(async () => {
      await User.deleteMany({});
    });
    it("Informacion Completa", async () => {
      const payload = {
        username: "Test",
        password: "A",
        email: "a@a.com",
        birthdate: new Date(2000, 3, 23),
        bio: "Hola",
      };
      const res = await request(app).post("/users").send(payload);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("token");
      const insertedUser = await User.findOne({ username: "Test" });
      expect(insertedUser.email).toEqual(payload.email);
      expect(insertedUser.birthdate).toEqual(payload.birthdate);
      expect(insertedUser.bio).toEqual(payload.bio);
    });
    it("Informacion Incompleta", async () => {
      const payload = {
        username: "Test",
        password: "A",
        email: "a@a.com",
        bio: "Hola",
      };
      const res = await request(app).post("/users").send(payload);
      expect(res.statusCode).toEqual(401);
      expect(res.body.message).toEqual("One or more fields are missing");
    });
  });
  describe("Login", () => {
    let token;
    //before login create user
    beforeAll(async () => {
      const payload = {
        username: "Test",
        password: "A",
        email: "a@a.com",
        birthdate: new Date(2000, 3, 23),
        bio: "Hola",
      };
      const res = await request(app).post("/users").send(payload);
      //save login token
      token = res.body.token;
    });
    afterAll(async () => {
      //delete all registered users
      await User.deleteMany({});
    });
    it("Informacion valida User/Pw", async () => {
      const payload = {
        username: "Test",
        password: "A",
      };
      const res = await request(app).post("/users/login").send(payload);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("token");
    });
    it("Informacion valida JWT", async () => {
      const res = await request(app).post("/users/login").send({ token });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual({});
    });
    it("Informacion invalida (usuario no existe)", async () => {
      const payload = {
        username: "Test2",
        password: "A",
      };
      const res = await request(app).post("/users/login").send(payload);
      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toEqual(`User ${payload.username} not found`);
    });
    it("Informacion invalida (contraseña incorrecta)", async () => {
      const payload = {
        username: "Test",
        password: "A2",
      };
      const res = await request(app).post("/users/login").send(payload);
      expect(res.statusCode).toEqual(401);
      expect(res.body.message).toEqual(`Password does not match`);
    });
  });
  describe("Informacion de Usuario", () => {
    let token;
    let userId;
    const payload = {
      username: "Test",
      password: "A",
      email: "a@a.com",
      birthdate: new Date(2000, 3, 23),
      bio: "Hola",
    };
    //before getting info create user
    beforeAll(async () => {
      const res = await request(app).post("/users").send(payload);
      const { _id } = await User.findOne({ username: payload.username }).lean();
      userId = _id.toString();
      //save login token
      token = res.body.token;
      //add some posts
      const post1 = await Post.create({
        author_id: userId,
        img_url: "",
        bio: "Primer Post",
      });
      await PostLike.create({
        author_id: userId,
        post_id: post1._id.toString(),
      });
      //The user follows 2 people
      await Follower.create({
        user_id: userId,
        following_id: "2",
      });
      await Follower.create({
        user_id: userId,
        following_id: "3",
      });
      //someone follows the user
      await Follower.create({
        user_id: "3",
        following_id: userId,
      });
    });
    afterAll(async () => {
      //delete all registered data
      await User.deleteMany({});
      await Post.deleteMany({});
      await PostLike.deleteMany({});
      await Follower.deleteMany({});
    });
    it("GetInfo Missing Authorization", async () => {
      const res = await request(app).get("/users").query({ user_id: userId });
      expect(res.statusCode).toEqual(401);
      expect(res.body.message).toEqual("Missing Authorization Token");
    });
    it("GetInfo MalformedToken", async () => {
      const res = await request(app)
        .get("/users")
        .query({ user_id: userId })
        .auth("123", { type: "bearer" });
      expect(res.statusCode).toEqual(500);
      expect(res.body.message).toEqual("jwt malformed");
    });
    it("GetInfo Success", async () => {
      const res = await request(app)
        .get("/users")
        .query({ user_id: userId })
        .auth(token, { type: "bearer" });
      expect(res.statusCode).toEqual(200);
      expect(
        [
          "username",
          "email",
          "bio",
          "liked_count",
          "posts_count",
          "followers_count",
          "followed_count",
        ].every((key) => res.body.hasOwnProperty(key))
      ).toBe(true);
    });
    it("Contraseña y fecha de cumpleaños no incluida", async () => {
      const res = await request(app)
        .get("/users")
        .query({ user_id: userId })
        .auth(token, { type: "bearer" });
      expect(res.body.birthdate).toBeUndefined();
      expect(res.body.password).toBeUndefined();
    });
    it("Numero de publicaciones del usuario", async () => {
      const res = await request(app)
        .get("/users")
        .query({ user_id: userId })
        .auth(token, { type: "bearer" });
      expect(res.body.posts_count).toEqual(1);
      expect(res.body.liked_count).toEqual(1);
    });
    it("Numero de publicaciones que le gustan al usuario", async () => {
      const res = await request(app)
        .get("/users")
        .query({ user_id: userId })
        .auth(token, { type: "bearer" });
      expect(res.body.liked_count).toEqual(1);
    });
    it("Numero de seguidores", async () => {
      const res = await request(app)
        .get("/users")
        .query({ user_id: userId })
        .auth(token, { type: "bearer" });
      expect(res.body.followers_count).toEqual(1);
    });
    it("Numero de seguidos", async () => {
      const res = await request(app)
        .get("/users")
        .query({ user_id: userId })
        .auth(token, { type: "bearer" });
      expect(res.body.followed_count).toEqual(2);
    });
  });
});
