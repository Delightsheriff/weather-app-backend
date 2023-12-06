const mongoose = require("mongoose");
const { User, AuthToken } = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//newUser
const registerUser = async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    const doesExist = await User.findOne({ email });

    if (doesExist) {
      return res
        .status(400)
        .json({ message: "This user account already exixt!" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      userName,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    return res.status(200).json({
      message: "Registration successful",
      User: { ...newUser._doc, password: "" }, //hiding the password from the frontend
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//existingUser
const signInUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const passwordValid = await bcrypt.compare(password, user.password);

    if (!passwordValid) {
      return res.status(401).json({ message: "Invalid Email & Password" });
    }

    // Generate tokens
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_REFRESH_EXPIRATION,
    });
    let refreshToken = await AuthToken.createToken(user);
    // console.log("Refresh token:", refreshToken);

    // Return success response
    return res.status(200).json({
      message: "Login successful",
      user: { ...user._doc, password: "" },
      accessToken: token,
      refreshToken,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//refreshToken
const refreshToken = async (req, res) => {
  const { refreshToken: requestToken } = req.body;
  if (requestToken == null) {
    return res.status(401).json({ message: "Refresh Token is required!" });
  }

  try {
    const existingToken = await AuthToken.findOne({ token: requestToken });

    if (!existingToken) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    if (AuthToken.verifyExpiration(existingToken)) {
      await AuthToken.deleteOne({ _id: existingToken._id });
      return res.status(401).json({
        message: "Refresh token was expired. Please make a new sign-in request",
      });
    }

    const user = await User.findById(existingToken.user);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const newAccessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_REFRESH_EXPIRATION,
    });

    return res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: existingToken.token,
    });
  } catch (err) {
    console.error("Error refreshing token:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { registerUser, signInUser, refreshToken };
