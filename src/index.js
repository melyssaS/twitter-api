const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectdb = require("./config/db");
const configRoutes = require("./routes");
//Avoid real config in test env
if (process.env.NODE_ENV !== "test") {
  connectdb();
}
const app = express();

const PORT = process.env.PORT || 8000;
// Apply middlewares
app.use(morgan("tiny"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

configRoutes(app);

app.get("/", (req, res) => {
  res
    .status(200)
    .send("https://gist.github.com/MattIPv4/045239bc27b16b2bcf7a3a9a4648c08a");
});

//just listen outside of test env
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server listening in port ${PORT}`);
  });
}

module.exports = app;
