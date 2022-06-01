const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema(
  {
    author: {
      type: String,
      required: true,
    },
    post_id: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: { createdAt: "created_at" } }
);

module.exports = mongoose.model("Comment", commentSchema);
