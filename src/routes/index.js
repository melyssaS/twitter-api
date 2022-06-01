const userRoute = require("./user.route");
const postsRoute = require("./posts.route");

const configRoutes = (app) => {
  app.use("/users", userRoute);
  app.use("/posts", postsRoute);
};

module.exports = configRoutes;
