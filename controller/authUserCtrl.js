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

// A function to refresh the access token using the refresh token
const refreshToken = async (req, res) => {
  // try {
  // Get the refresh token from the request body
  const { refreshToken } = req.body;

  // If there is no refresh token, return a 400 error
  if (!refreshToken) {
    return res.status(400).json({ message: "Refresh token is required" });
  }

  // Verify the refresh token with the secret key
  const payload = jwt.verify(refreshToken, process.env.JWT_SECRET);

  // Find the user by id using mongoose
  const user = await User.findById(payload.id);

  // If the user is not found, return a 404 error
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // If the refresh token does not match the user's refresh token, return a 401 error
  if (refreshToken !== user.refreshToken) {
    return res
      .status(401)
      .json({ message: "Refresh token is invalid or expired" });
  }

  // Generate new tokens using the createTokens function
  const tokens = await createTokens(payload);
  console.log(tokens);

  // Save the new refresh token to the user document using mongoose
  user.refreshToken = tokens.refreshToken;
  await user.save();

  // Return a success response with the new access token
  return res
    .status(200)
    .json({ message: "Token refreshed", accessToken: tokens.accessToken });
  // } catch (error) {
  //   // If there is an error, return a 500 error
  //   return res.status(500).json({ message: error.message });
  // }
};

module.exports = { registerUser, signInUser, refreshToken };
