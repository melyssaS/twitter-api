const userRoute = require("./user.route");

const configRoutes = (app) => {
  app.use("/users", userRoute);
};

module.exports = configRoutes;
