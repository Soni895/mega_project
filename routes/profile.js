const express= require("express");
const router= express.Router();

const {Auth}= require("../middlewares/auth");
const {GetallUserDetailes,DeleteAccout,UpdateProfile}= require("../controllers/profile");

const {GetEnrolledCourses,UpdateDisplayPicture}=require("../controllers/profile");
 
//                             Profile routes
router.delete("/DeleteAccout", DeleteAccout);                            //testing pending

router.put("/updateProfile", Auth, UpdateProfile);
router.get("/getallUserDetailes", Auth, GetallUserDetailes);

// Get Enrolled Courses
router.get("/getEnrolledCourses", Auth, GetEnrolledCourses);           //testing pending
router.put("/UpdateDisplayPicture", Auth, UpdateDisplayPicture);      //testing pending

module.exports = router;