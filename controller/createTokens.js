const jwt = require("jsonwebtoken");
// A function to create different types of tokens using jwt
async function createTokens(payload) {
  // Import the jwt module

  // Create an object to store the tokens
  const tokens = {};

  // Create the active token with 5 hours expiration
  tokens.activeToken = await jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });

  // Create the access token with 3 minutes expiration
  tokens.accessToken = await jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  // Create the refresh token with 3 days expiration
  tokens.refreshToken = await jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  // Return the tokens object
  return tokens;
}

module.exports = createTokens;
