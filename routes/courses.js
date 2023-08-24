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
router.post("/DeleteSection/:SectionId",Auth,IsInstructor,DeleteSection);    // pending need to think how to get course id  through user id``
// Edit Sub Section
router.post('/UpdateSubSection',Auth,IsInstructor,UpdateSubSection);
// Delete Sub Section
router.post("/DeleteSubsection",Auth,IsInstructor,DeleteSubsection);   // pending need to think how to get course id  through user id
// Add a Sub Section to a Section
router.post('/CreateSubsection',Auth,IsInstructor,CreateSubsection);
// Get all Registered Courses
router.get("/ShowAllCourses",Auth,ShowAllCourses);
// Get Details for a Specific Courses
router.post("/GetCourseDetails",Auth,GetCourseDetails);   // testing pending issue in population of detailes

//                 Category routes (Only by Admin)
// Category can Only be Created by Admin

router.post("/createCategory", Auth, IsAdmin, CreateCategory);
router.get("/GetAllCategory", GetAllCategory);
router.post("/CategoryPageDetailes", CategoryPageDetailes);               //pending


//                       Rating and Review
router.post("/createRating", Auth, IsStudent, Createrating)
router.get("/getAverageRating", GetAverageRating)
router.get("/getReviews", GetAllRating);


module.exports = router;