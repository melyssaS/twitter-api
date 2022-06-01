const mongoose = require("mongoose");
const followerSchema = new mongoose.Schema(
  {
    //the user
    user_id: {
      type: String,
      required: true,
    },
    //the id of an user that this user follows
    following_id: {
      type: String,
      required: true,
    },
  },
  { timestamps: { createdAt: "created_at" } }
);

module.exports = mongoose.model("Follower", followerSchema);
