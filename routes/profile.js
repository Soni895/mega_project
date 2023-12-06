const express= require("express");
const router= express.Router();

const {Auth,IsInstructor}= require("../middlewares/auth");
const {GetallUserDetailes,DeleteAccout,UpdateProfile,UpdateDisplayPicture,GetEnrolledCourses}= require("../controllers/profile");

const {InstructorDashboard}=require("../controllers/profile");   //completed
// should be maked
 
//                             Profile routes
router.delete("/DeleteAccout",Auth, DeleteAccout);                           
router.put("/UpdateProfile", Auth, UpdateProfile);
router.get("/getallUserDetailes", Auth, GetallUserDetailes);   

// Get Enrolled Courses
router.put("/UpdateDisplayPicture", Auth, UpdateDisplayPicture); 
router.get("/GetEnrolledCourses", Auth, GetEnrolledCourses);         //   pending    
router.get("/InstructorDashboard", Auth, IsInstructor, InstructorDashboard);    //completed
module.exports = router;