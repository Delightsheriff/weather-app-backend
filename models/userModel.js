const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    userName: { type: String, require: true, lowercase: true },

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
  },
  { timestamps: true }
);
const User = mongoose.model("Users", userSchema);

const authTokenSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    token: { type: String, required: true },
    email: { type: String, required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

const AuthToken = mongoose.model("AuthToken", authTokenSchema);

module.exports = { User, AuthToken };
