const mongoose = require("mongoose");

const User = require("../models/user");
const Follower = require("../models/follower");
const Request = require("../models/request");

const request = require("supertest");
const app = require("../index");

describe("Follows Endpoint", () => {
  beforeAll(async () => {
    await mongoose.connect(global.__MONGO_URI__);
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  describe("Usuarios seguidos por un usuario", () => {
    let userId1, token1;
    let userId2, token2;
    let userId3, token3;
    let requestId;
    beforeAll(async () => {
      const res1 = await request(app)
        .post("/users")
        .send({
          username: "Test",
          password: "A",
          email: "a@a.com",
          birthdate: new Date(2000, 3, 23),
          bio: "Hola",
        });
      token1 = res1.body.token;
      userId1 = await User.findOne({ username: "Test" }).lean();
      userId1 = userId1._id.toString();

      const res2 = await request(app)
        .post("/users")
        .send({
          username: "Test 2",
          password: "B",
          email: "b@b.com",
          birthdate: new Date(2000, 3, 23),
          bio: "Hola",
        });
      token2 = res2.body.token;
      userId2 = await User.findOne({ username: "Test 2" }).lean();
      userId2 = userId2._id.toString();

      const res3 = await request(app)
        .post("/users")
        .send({
          username: "Test 4",
          password: "c",
          email: "c@c.com",
          birthdate: new Date(2000, 3, 23),
          bio: "Hola",
        });
      token3 = res3.body.token;
      userId3 = await User.findOne({ username: "Test 4" }).lean();
      userId3 = userId3._id.toString();

      await Follower.create({
        user_id: userId2,
        following_id: userId1,
      });
      await Follower.create({
        user_id: userId1,
        following_id: userId2,
      });
      const newRequest = await Request.create({
        from_id: userId3,
        to_id: userId1,
        status: "request",
      });
      requestId = newRequest._id.toString();
    });

    afterAll(async () => {
      await User.deleteMany({});
      await Follower.deleteMany({});
    });

    it("Usuario siguiendo", async () => {
      const res = await request(app)
        .get("/follows/following")
        .query({ user_id: userId2 })
        .auth(token1, { type: "bearer" });
      expect(res.statusCode).toEqual(200);
      expect(res.body.users[0].following_id).toEqual(userId2);
    });

    it("Usuario siguiendo", async () => {
      const res = await request(app)
        .get("/follows/followers")
        .query({ user_id: userId2 })
        .auth(token1, { type: "bearer" });
      expect(res.statusCode).toEqual(200);
      expect(res.body.users[0].user_id).toEqual(userId2);
    });

    it("Usuario peticion", async () => {
      const res = await request(app)
        .post("/follows/request")
        .send({ user_id: userId2 })
        .auth(token3, { type: "bearer" });
      expect(res.statusCode).toEqual(200);
    });

    it("Usuario peticion", async () => {
      const res = await request(app)
        .post("/follows/request")
        .send({ user_id: userId2 })
        .auth(token3, { type: "bearer" });
      expect(res.statusCode).toEqual(200);
    });

    it("Usuario response", async () => {
      const res = await request(app)
        .post("/follows/response")
        .send({ request_id:requestId, action: "accept" })
        .auth(token3, { type: "bearer" });
      expect(res.statusCode).toEqual(200);
    });
  });
});
