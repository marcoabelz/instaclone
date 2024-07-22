// require('dotenv').config()
const { sign, verify } = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;
// const secret = "gryta";

module.exports = {
  signToken: (payload) => sign(payload, secret), //create token
  verifyToken: (token) => verify(token, secret), //decode token
};
