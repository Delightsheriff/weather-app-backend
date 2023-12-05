const validateRegisterUser = (req, res, next) => {
  const { username, email, password } = req.body;
  const errors = {};

  // Validate username
  if (!username) {
    errors.username = ["Please enter your username"];
  }

  // Validate email
  if (!email) {
    errors.email = ["Please enter your email"];
  } else if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)) {
    errors.email = ["Please enter a valid email address"];
  }

  // Validate password
  if (!password) {
    errors.password = ["Please enter a password"];
  } else {
    if (password.length < 8) {
      errors.password = ["Password must be at least 8 characters long"];
    }
    if (!/[A-Z]/.test(password)) {
      errors.password = ["Password must contain at least one uppercase letter"];
    }
    if (!/[0-9]/.test(password)) {
      errors.password = ["Password must contain at least one digit"];
    }
  }

  // Check for any errors
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  // Proceed to the next middleware if no errors
  next();
};

const validateSignInUser = (req, res, next) => {
  const { email, password } = req.body;
  const errors = {};

  // Validate email
  if (!email) {
    errors.email = ["Please enter your email"];
  }

  // Validate password
  if (!password) {
    errors.password = ["Please enter a password."];
  }

  // Check for any errors
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  // Proceed to the next middleware if no errors
  next();
};

module.exports = { validateRegisterUser, validateSignInUser };
