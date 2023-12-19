// Import the required modules
const express= require("express");
const router= express.Router();

const { CapturePayment, VerifySignature,sendPaymentSuccessEmail } = require("../controllers/payments")
const {Auth, IsStudent }=require("../middlewares/auth");
router.post("/capturePayment", Auth, IsStudent, CapturePayment);
router.post("/verifySignature",Auth, IsStudent,VerifySignature);
router.post("/sendPaymentSuccessEmail",Auth,IsStudent,sendPaymentSuccessEmail)

module.exports = router;
