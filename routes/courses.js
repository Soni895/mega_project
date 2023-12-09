const express= require("express");
const router= express.Router();

// Importing Middlewares
const {Auth,IsInstructor, IsStudent, IsAdmin }=require("../middlewares/auth");
// Course Controllers Import
const {GetCourseDetails,GetAllCourses,CreateCourse,EditCourse,DeleteCourse,GetInstructorCourses,GetFullCourseDetails,UpdateCourseProgress}= require("../controllers/course");
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

router.post("/CreateCourse",Auth,IsInstructor,CreateCourse);    // completed
// Edit Course routes
router.put("/EditCourse", Auth, IsInstructor, EditCourse)  ;                      //*****        pending           ***      
// Delete a Course
router.delete("/DeleteCourse", DeleteCourse); //  complete verfied  

//Add a Section to a Course
router.post("/CreateSection",Auth,IsInstructor,CreateSection);   //completed
// Update a Section
router.post("/UpdateSection",Auth,IsInstructor,UpdateSection);    //completed
// Delete a Section
router.delete("/DeleteSection/:SectionId",Auth,IsInstructor,DeleteSection);   //completed

// create a sub section to a Section
router.post('/CreateSubsection',Auth,IsInstructor,CreateSubsection);   //complteted
// update sub section
router.post('/UpdateSubSection',Auth,IsInstructor,UpdateSubSection);   //completed
// Delete Sub Section
router.post("/DeleteSubsection",Auth,IsInstructor,DeleteSubsection);  // complted

// Get all Registered Courses
router.get("/GetAllCourses",Auth,GetAllCourses);       //completed
// Get Details for a Specific Courses
router.post("/GetCourseDetails",Auth,GetCourseDetails);  // completed

// Get all Courses Under a Specific Instructor  ....
router.get("/GetInstructorCourses", Auth, IsInstructor,GetInstructorCourses)  
// Get Details for a Specific Courses
router.post("/GetFullCourseDetails", Auth, GetFullCourseDetails)
// To Update Course Progress
router.post("/UpdateCourseProgress", Auth, IsStudent, UpdateCourseProgress);
// To get Course Progress
// router.post("/getProgressPercentage", auth, isStudent, getProgressPercentage)



//                            Category routes (Only by Admin)
// Category can Only be Created by Admin
router.post("/createCategory", Auth, IsAdmin, CreateCategory);  //completed
router.get("/GetAllCategory", GetAllCategory);                 //completed
router.post("/CategoryPageDetailes", CategoryPageDetailes);   //  verifyied


//                           Rating and Review                               
router.post("/createRating", Auth, IsStudent, Createrating)              //pending
router.get("/getAverageRating", GetAverageRating)                        // pending
router.get("/getReviews", GetAllRating);                              //pending


module.exports = router;