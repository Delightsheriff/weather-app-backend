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
  },
  { timestamps: true }
);
const User = mongoose.model("Users", userSchema);

const authTokenSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    token: { type: String, required: true },
    expiryDate: { type: Date, required: true },
  },
  { timestamps: true }
);

authTokenSchema.statics.createToken = async function (user) {
  const expiryDate = new Date();
  expiryDate.setSeconds(
    expiryDate.getSeconds() + parseInt(process.env.JWT_REFRESH_EXPIRATION, 10)
  );

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRATION,
  });

  const refreshToken = new this({
    token: token,
    user: user._id,
    expiryDate: expiryDate,
  });

  await refreshToken.save();
  return refreshToken.token;
};

authTokenSchema.statics.verifyExpiration = function (token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.exp * 1000 < new Date().getTime();
  } catch (error) {
    return true; // Token is invalid if verification fails
  }
};

authTokenSchema.statics.associate = function (models) {
  // Assuming you have a User model
  this.belongsTo(models.User, { foreignKey: "user", as: "user_id" });
};

const AuthToken = mongoose.model("AuthToken", authTokenSchema);

// module.exports = AuthToken;

module.exports = { User, AuthToken };
