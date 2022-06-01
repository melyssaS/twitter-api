const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  birthdate: {
    type: Date,
    required: true,
  },
  bio: {
    type: String,
    default: "",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const hashPw = async (pw) => {
  return bcrypt.hash(pw, bcrypt.genSaltSync(10));
};

//pre save hook to hash pw before saving
//@see https://coderrocketfuel.com/article/store-passwords-in-mongodb-with-node-js-mongoose-and-bcrypt
userSchema.pre("save", async function () {
  if (this.isModified("password") || this.isNew) {
    this.password = await hashPw(this.password);
  }
});

module.exports = mongoose.model("User", userSchema);
