const mongoose = require("mongoose");
const { User, AuthToken } = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const createTokens = require("./createTokens");

//newUser
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const doesExist = await User.findOne({ email });

    if (doesExist) {
      return res
        .status(400)
        .json({ message: "This user account already exist!" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    return res.status(200).json({
      message: "Registration successful",
      User: { ...newUser._doc, password: "" },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//existingUser
// A function to sign in a user using bcrypt and jwt
const signInUser = async (req, res) => {
  try {
    // Get the email and password from the request body
    const { email, password } = req.body;

    // Find the user by email using async and await
    const user = await User.findOne({ email });

    // If the user is not found, return a 401 error
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Compare the password with the hashed password using async and await
    const passwordValid = await bcrypt.compare(password, user.password);

    // If the password is not valid, return a 401 error
    if (!passwordValid) {
      return res.status(401).json({ message: "Invalid Email & Password" });
    }

    // Generate tokens using the createTokens function
    const payload = {
      id: user._id,
    };
    const tokens = await createTokens(payload);

    // Save the refresh token to the user document
    user.refreshToken = tokens.refreshToken;
    await user.save();

    // Return a success response with the user and the tokens
    return res.status(200).json({
      message: "Login successful",
      user: { ...user._doc, password: "" },
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  } catch (error) {
    // Handle any errors and return a 500 error
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, signInUser };
