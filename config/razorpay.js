const Razorpay = require('razorpay');
require("dotenv").config();

const key_id=process.env.key_id;
const razorpay_key_secret=process.env.razorpay_key_secret;
console.log("credintials",key_id,razorpay_key_secret);
exports.instance = new Razorpay({
    key_id,
    key_secret:  razorpay_key_secret,
  });
