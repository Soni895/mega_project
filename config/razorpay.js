const Razorpay = require('razorpay');
require("dotenv").config();
const key_id=process.env.key_id;
const key_secret=process.env.key_secret;
exports.instance = new Razorpay({
    key_id,
    key_secret,
  });