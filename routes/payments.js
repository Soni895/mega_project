// Import the required modules
const express= require("express");
const router= express.Router();

const { CapturePayment, VerifySignature } = require("../controllers/payments")
const {Auth,IsInstructor, IsStudent, IsAdmin }=require("../middlewares/auth");
router.post("/capturePayment", Auth, IsStudent, CapturePayment);
// router.post("/verifySignature", VerifySignature);

module.exports = router;