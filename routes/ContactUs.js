const express= require("express");
const router= express.Router();

const  {ContactUs}= require("../controllers/ContactUs")

router.post("/Contact",ContactUs);
module.exports= router;
