const mongoose = require("mongoose");
const Posts = require("../models/posts");
const request = require("supertest");
const app = require("../index");

describe("Post Endpoint", () => {
  beforeAll(async () => {
    await mongoose.connect(global.__MONGO_URI__);
  });
  afterAll(async () => {
    await mongoose.disconnect();
  });
  it("Should Dar me gusta a publicacion", async () => {
    
  });

  it("Should Mostrar Publicaciones gustadas por un usuario", async () => {
    
  });

  it("Should  Guardar publicacion", async () => {
    
  });

  it("Should Mostrar Publicaciones guardadas por un usuario", async () => {
    
  });

  it("Should Comentar publicacion", async () => {
    
  });

  it("Should Mostrar Comentarios de una publicacion", async () => {
    
  });

});