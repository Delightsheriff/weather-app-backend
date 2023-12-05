const mongoose = require("mongoose");
const { User } = require("../models/userModel");
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
      expiresIn: process.env.JWT_EXPIRATION,
    });

    // Return success response
    return res.status(200).json({
      message: "Login successful",
      user: { ...user._doc, password: "" },
      accessToken: token,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, signInUser };
