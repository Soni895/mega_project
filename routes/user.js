const express= require("express");
const router= express.Router();

const {SendOtp,SignUp,Login,ChangePassword}=require("../controllers/auth");
const{ResetPasswordToken,ResetPassword}= require("../controllers/resetpassword");
const {Auth}= require("../middlewares/auth");

//                       Authentication routes
// Route for user login
router.post("/Login", Login)

// Route for user signup
router.post("/Signup", SignUp)

// Route for sending OTP to the user's email
router.post("/Sendotp", SendOtp)

// Route for Changing the password
router.post("/Changepassword", Auth, ChangePassword);

//   Reset Password
// Route for generating a reset password token
router.post("/Reset-Password-Token", ResetPasswordToken);


// Route for resetting user's password after verification
router.post("/Reset-Password", ResetPassword);

module.exports = router;