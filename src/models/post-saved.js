const mongoose = require("mongoose");
const postSavedSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
    },
    post_id: {
      type: String,
      required: true,
    },
  },
  { timestamps: { createdAt: "created_at" } }
);

module.exports = mongoose.model("PostSaved", postSavedSchema);
