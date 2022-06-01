const userRoute = require("./user.route");
const postRoute = require("./post.route");
const { validateToken } = require("../config/auth");
//use this to check for auth in token
const unless = function (middleware, ...routes) {
  return function (req, res, next) {
    const pathCheck = routes.some(
      (route) => route.path === req.path && route.method === req.method
    );
    pathCheck ? next() : middleware(req, res, next);
  };
};

const protectedRoute = (req, res, next) => {
  try {
    if (!req.headers["authorization"]) {
      return res.status(401).json({ message: "Missing Authorization Token" });
    }
    const token = req.headers["authorization"].split(" ")[1];
    const isAuthenticated = validateToken(token);
    if (!isAuthenticated) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: e.message });
  }

  next();
};

const configRoutes = (app) => {
  //configure all the routes to use the protectedRoute middleware expect for users login and register
  app.use(
    unless(
      protectedRoute,
      { path: "/users/login", method: "POST" },
      { path: "/users", method: "POST" }
    )
  );
  app.use("/users", userRoute);
  app.use("/posts", postRoute);
};

module.exports = configRoutes;
