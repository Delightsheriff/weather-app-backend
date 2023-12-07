// A function to create different types of tokens using jwt
async function createTokens(payload) {
  // Import the jwt module
  const jwt = require("jsonwebtoken");

  // Create an object to store the tokens
  const tokens = {};

  // Delete the exp property from the payload object if it exists
  delete payload.exp;

  // Create the active token with 15 minutes expiration
  tokens.activeToken = await jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });

  // Create the access token with 1 hour expiration
  tokens.accessToken = await jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  // Create the refresh token with 7 days expiration
  tokens.refreshToken = await jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  // Return the tokens object
  return tokens;
}
module.exports = createTokens;
