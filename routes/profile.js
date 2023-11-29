const express= require("express");
const router= express.Router();

const {Auth,IsInstructor}= require("../middlewares/auth");
const {GetallUserDetailes,DeleteAccout,UpdateProfile,UpdateDisplayPicture,GetEnrolledCourses}= require("../controllers/profile");

const {InstructorDashboard}=require("../controllers/profile");   //pending
// should be maked
 
//                             Profile routes
router.delete("/DeleteAccout",Auth, DeleteAccout);                           
router.put("/updateProfile", Auth, UpdateProfile);
router.get("/getallUserDetailes", Auth, GetallUserDetailes);

// Get Enrolled Courses
router.get("/getEnrolledCourses", Auth, GetEnrolledCourses);             
router.put("/UpdateDisplayPicture", Auth, UpdateDisplayPicture);     
router.get("/instructorDashboard", Auth, IsInstructor, InstructorDashboard);    // pending 

module.exports = router;