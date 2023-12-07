const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, require: true, lowercase: true },

    email: {
      type: String,
      require: true,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String, // Corrected from "String" to String
      description: "The user's password",
      require: true,
      minlength: 8,
    },
    refreshToken: { type: String },
  },
  { timestamps: true }
);
const User = mongoose.model("Users", userSchema);

module.exports = { User };
