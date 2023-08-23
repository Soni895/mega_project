const express= require("express");
const router= express.Router();

// Importing Middlewares
const {Auth,IsInstructor, IsStudent, IsAdmin }=require("../middlewares/auth");
// Course Controllers Import
const {GetAllCourseDetailes,ShowAllCourses,CreateCourse}= require("../controllers/course");
// Categories Controllers Import
const{CategoryPageDetailes,GetAllCategory,CreateCategory}= require("../controllers/category");
// Sections Controllers Import
const {DeleteSection,UpdateSection,CreateSection}= require("../controllers/section");
// Sub-Sections Controllers Import
const {DeleteSubsection,SubsectionUpdate,CreateSubsection} =require("../controllers/subsection");
// Rating Controllers Import
const {GetAllRating,GetAverageRating,Createrating} =require("../controllers/rating and review")


// Courses can Only be Created by Instructors

//                              Course routes

router.post("/createCourse",Auth,IsInstructor,CreateCourse);

//Add a Section to a Course
router.post("/addSection",Auth,IsInstructor,CreateSection);
// Update a Section
router.post("/updateSection",Auth,IsInstructor,UpdateSection);
// Delete a Section
router.post("/deleteSection",Auth,IsInstructor,DeleteSection);
// Edit Sub Section
router.post('updateSubSection',Auth,IsInstructor,SubsectionUpdate);
// Delete Sub Section
router.post("deleteSubSection",Auth,IsInstructor,DeleteSubsection);
// Add a Sub Section to a Section
router.post('addSubSection',Auth,IsInstructor,CreateSubsection);
// Get all Registered Courses
router.get("getAllCourses",Auth,ShowAllCourses);
// Get Details for a Specific Courses
router.post("getCourseDetails",Auth,GetAllCourseDetailes);

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