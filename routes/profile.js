const express= require("express");
const router= express.Router();

const {Auth}= require("../middlewares/auth");
const {GetallUserDetailes,DeleteAcout,UpdateProfile}= require("../controllers/profile");

const {GetEnrolledCourses,UpdateDisplayPicture}=require("../controllers/profile");
 
//                             Profile routes
router.delete("/deleteAcoout", DeleteAcout);
router.put("/updateProfile", Auth, UpdateProfile);
router.get("/getallUserDetailes", Auth, GetallUserDetailes);

// Get Enrolled Courses
router.get("/getEnrolledCourses", Auth, GetEnrolledCourses);
router.put("/updateDisplayPicture", Auth, UpdateDisplayPicture);

module.exports = router;