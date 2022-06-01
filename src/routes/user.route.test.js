const mongoose = require("mongoose");
const User = require("../models/user");
const request = require("supertest");
const app = require("../index");

describe("User Endpoint", () => {
  beforeAll(async () => {
    await mongoose.connect(global.__MONGO_URI__);
  });
  afterAll(async () => {
    await mongoose.disconnect();
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
});
