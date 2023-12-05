const express = require("express");

const { registerUser, signInUser } = require("../controller/authUserCtrl");
const {
  validateRegisterUser,
  validateSignInUser,
} = require("../middleware/authUserValidation");

const router = express.Router();

// Registration route
router.post("/sign-up", validateRegisterUser, registerUser);

// Signin route
router.post("/sign-in", validateSignInUser, signInUser);

module.exports = router;
