const express = require("express");

const {
  registerUser,
  signInUser,
  refreshToken,
} = require("../controller/authUserCtrl");
const {
  validateRegisterUser,
  validateSignInUser,
} = require("../middleware/authUserValidation");

const router = express.Router();

// Registration route
router.post("/sign-up", validateRegisterUser, registerUser);

// Signin route
router.post("/sign-in", validateSignInUser, signInUser);

// Refresh token route
router.post("/refresh-token", refreshToken);

module.exports = router;
