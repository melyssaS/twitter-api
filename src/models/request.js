const mongoose = require("mongoose");
const requestSchema = new mongoose.Schema(
  {
    from_id: {
      type: String,
      required: true,
    },
    to_id: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: false,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("Request", requestSchema);
