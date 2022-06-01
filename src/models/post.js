const mongoose = require("mongoose");
const postSchema = new mongoose.Schema(
  {
    author_id: {
      type: String,
      required: true,
    },
    img_url: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      required: true,
    },
  },
  { timestamps: { createdAt: "created_at" } }
);

module.exports = mongoose.model("Post", postSchema);
