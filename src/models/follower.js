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

/**
 * If user 0 follows user 1 and 2 then
 * {user_id: 0, following_id: 1}
 * {user_id: 0, following_id: 1}
 */

module.exports = mongoose.model("Follower", followerSchema);
