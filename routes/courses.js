const express= require("express");
const router= express.Router();

// Importing Middlewares
const {Auth,IsInstructor, IsStudent, IsAdmin }=require("../middlewares/auth");
// Course Controllers Import
const {GetCourseDetails,ShowAllCourses,CreateCourse}= require("../controllers/course");
// Categories Controllers Import
const{CategoryPageDetailes,GetAllCategory,CreateCategory}= require("../controllers/category");
// Sections Controllers Import
const {DeleteSection,UpdateSection,CreateSection}= require("../controllers/section");
// Sub-Sections Controllers Import
const {DeleteSubsection,UpdateSubSection,CreateSubsection} =require("../controllers/subsection");
// Rating Controllers Import
const {GetAllRating,GetAverageRating,Createrating} =require("../controllers/rating and review")



// Courses can Only be Created by Instructors

//                              Course routes

router.post("/createCourse",Auth,IsInstructor,CreateCourse);   

//Add a Section to a Course
router.post("/CreateSection",Auth,IsInstructor,CreateSection);
// Update a Section
router.post("/updateSection",Auth,IsInstructor,UpdateSection);
// Delete a Section
router.post("/DeleteSection/:SectionId",Auth,IsInstructor,DeleteSection);   
router.post('/UpdateSubSection',Auth,IsInstructor,UpdateSubSection);
// Delete Sub Section
router.post("/DeleteSubsection",Auth,IsInstructor,DeleteSubsection);  
// Add a Sub Section to a Section
router.post('/CreateSubsection',Auth,IsInstructor,CreateSubsection);
// Get all Registered Courses
router.get("/ShowAllCourses",Auth,ShowAllCourses);
// Get Details for a Specific Courses
router.post("/GetCourseDetails",Auth,GetCourseDetails); 

//                            Category routes (Only by Admin)
// Category can Only be Created by Admin

router.post("/createCategory", Auth, IsAdmin, CreateCategory);
router.get("/GetAllCategory", GetAllCategory);   
router.post("/CategoryPageDetailes", CategoryPageDetailes);              


//                           Rating and Review                               
router.post("/createRating", Auth, IsStudent, Createrating)              //pending
router.get("/getAverageRating", GetAverageRating)                        // pending
router.get("/getReviews", GetAllRating);                              //pending


module.exports = router;