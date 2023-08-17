const express= require("express");
const router= express.Router();

const {SendOtp,SignUp,Login,ChangePassword}=require("../controllers/auth");
const{ResetPasswordToken,ResetPassword}= require("../controllers/resetpassword");
const {Auth}= require("../middlewares/auth");

//                       Authentication routes
// Route for user login
router.post("/login", Login)

// Route for user signup
router.post("/signup", SignUp)

// Route for sending OTP to the user's email
router.post("/sendotp", SendOtp)

// Route for Changing the password
router.post("/changepassword", Auth, ChangePassword);

//   Reset Password
// Route for generating a reset password token
router.post("/reset-password-token", ResetPasswordToken);


// Route for resetting user's password after verification
router.post("/reset-password", ResetPassword)

module.exports = router;