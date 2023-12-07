const Course = require("../models/course");
const category = require("../models/category");
const User = require("../models/user");
const Section= require("../models/section");
const SubSection=require("../models/SubSection")
const ImageUploadToCloudinary = require("../utils/imageuploader");

// create Course
// get all caurse

exports.CreateCourse = async (req, res) => {
  try {
    // data
    // File
    // validation
    // Category



    const {
      CourseName,
      CourseDescription,
      WhatYouWillLearn,
      Price,
      Tag,                 // type array
      Category,             //id
      Status,                    //  ["Draft", "Published"],
      Instructions,           // type array
    } = req.body;
    const Thumbmail = req.files.Thumbmail;
   
// Convert the tag and instructions from stringified Array to Array
const _Tag = JSON.parse(Tag);
const _instructions = JSON.parse(Instructions);

console.log("tag", _Tag)
console.log("instructions", _instructions)
    console.log(
      "CourseName,CourseDescription,Price,Category,WhatYouWillLearn,Status,Instructions==>",
      CourseName,
      CourseDescription,
      Price,
      Category,
      WhatYouWillLearn,
    Status,Instructions
    );

    console.log("User=>",req.User);

    //validation
    if (
      !CourseName ||
      !WhatYouWillLearn ||
      !Category ||
      !Price ||
      !CourseDescription ||
      !Thumbmail  || !Instructions
    ) {
      return res.status(401).json({
        status: "Unsuccessful",
        success: false,
        message: "please fill all the details",
      });
    }
    // check is instructor

    const UserId = req.User.id;

    console.log("UserId=>", UserId);

    const InstructorDetails = await User.findById(UserId);
    console.log(InstructorDetails._id);
    console.log(InstructorDetails._id.toString());

    console.log("InstructorDetails=>", InstructorDetails);

    // verify that serid and instrctor id is same or not ??????????????

    if (!InstructorDetails) {
      return res.status(401).json({
        status: "Unsuccessful",
        success: false,
        message: "Instrctor detailes not found",
      });
    }
    if (!Status || Status === undefined) {
      Status = "Draft"
    }
     // Check if the user is an instructor
     const instructorDetails = await User.findById(UserId, {
      accountType: "Instructor",
    })
    if (!instructorDetails) {
      return res.status(404).json({
        success: false,
        message: "Instructor Details Not Found",
      })
    }

    // check given Category is valid or not
    const CategoryDetailes = await category.findById(Category);

    console.log("CategoryDetailes=>", CategoryDetailes);
    if (!CategoryDetailes) {
      return res.status(401).json({
        status: "Unsuccessful",
        success: false,
        message: "invalid Category",
      });
    }
    //  upload image to cloudinary

    const ThumbnailImg = await ImageUploadToCloudinary(
      Thumbmail,
      process.env.Folder_name
    );
    console.log("ThumbnailImg=>", ThumbnailImg);

    // create a entry for new course

    const NewCourse = await Course.create({
      CourseName,
      CourseDescription,
      Price,
      WhatYouWillLearn,
      Thumbmail: ThumbnailImg.secure_url,
      Instructor: InstructorDetails._id,
      Category: CategoryDetailes._id,
      Tag,
      Status,
      Instructions,
      Category:CategoryDetailes._id,
    });

    console.log("NewCourse=>", NewCourse);

    // add the new course of user schema of instructor
    const Updated_Course = await User.findByIdAndUpdate(
      { _id: UserId },
      {
        $push: {
          Courses: NewCourse._id,
        },
      },
      { new: true }
    )
      .populate("Courses")
      .exec();
    console.log("Updated_Course=>", Updated_Course);

    // update Category schema todo.

    const Updated_Category = await category
      .findByIdAndUpdate(
        { _id: CategoryDetailes._id },
        {
          $push: {
            Course: NewCourse._id,
          },
        },
        { new: true }
      )
      .populate("Course")
      .exec();
    console.log("Updated_Category=>", Updated_Category);

    return res.status(200).json({
      status: "successfull",
      message: "course created successful",
      success: true,
      Updated_Category,
      NewCourse,
      Updated_Course,
      Tag,
    });
  } catch (error) {
    return res.status(500).json({
      status: "Unsuccessful",
      success: false,
      message: "course not created please try again",
      error,
    });
  }
};

// get all courses

exports.GetAllCourses = async (req, res) => {
  try {
    const AllCourse = await Course.find(
      { Status: "Published" },
      {
        CourseName: true,
        Price: true,
        Thumbmail: true,
        Instructor: true,
        RatingAndREview: true,
        StudentEnrolled: true,
      }
    )
      .populate("Instructor")
      .exec();

    return res.status(200).json({
      status: "Successful",
      success: true,
      message: "All courses find successful",
      AllCourse,
    });
  } catch (error) {
    return res.status(500).json({
      status: "Unsuccessful",
      success: false,
      message: "course not created please try again",
      error,
    });
  }
};

exports.GetCourseDetails = async (req, res) => {
  try {
    // fetch course id;
    const { CourseId } = req.body;

    console.log("CourseId=>", CourseId);
    // find course detailed
    const CourseDetailes = await Course.find({ _id: CourseId })
      .populate({
        path: "Instructor",
        populate: [
          { path: "AdditionalDetails" }, // Populate 'AdditionalDetails' field within 'instructor'
          { path: "Courses", populate: "CourseContent" }, // Populate 'Courses' field within 'instructor'
      //  { path: 'CourseProgrss' },      // Populate 'CourseProgrss' field within 'instructor'
        ],
      })
      .populate({
        path: "CourseContent",
        populate: "SubSection",
      })
      .populate("RatingAndREview")
      .populate(
        {
            path:"Category",
            populate:"Course",
        
        }
      )
      .populate("StudentEnrolled")
      .exec();

    console.log("CourseDetailes=>", CourseDetailes);
    if (!CourseDetailes) {
      return res.status(400).json({
        success: false,
        status: "Unsuccessful",
        message: "Course detailes not found",
      });
    }
    return res.status(200).json({
      staus: "successful",
      Success: true,
      CourseDetailes,
      CourseId,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      status: "Unsuccessful",
      message: "unable to get course deatailes",
      error,
    });
  }
};

exports.EditCourse= async (req,res)=>
{
  try {
    
  } catch (error) {
    
  }
}



// Delete the Course
exports.DeleteCourse = async (req, res) => {
  try {
    const { CourseId } = req.body

    // Find the course
    const course = await Course.findById(CourseId)
    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }

    // Unenroll students from the course
    const studentsEnrolled = course.StudentEnrolled
    for (const studentId of studentsEnrolled) {
      await User.findByIdAndUpdate(studentId, {
        $pull: { Courses: CourseId },
      })
    }

    // Delete sections and sub-sections
    const courseSections = course.CourseContent
    for (const sectionId of courseSections) {
      // Delete sub-sections of the section
      const section = await Section.findById(sectionId)
      if (section) {
        const subSections = section.SubSection
        for (const subSectionId of subSections) {
          await SubSection.findByIdAndDelete(subSectionId)
        }
      }

      // Delete the section
      await Section.findByIdAndDelete(sectionId);
    }

    // Delete the course
  const response=  await Course.findByIdAndDelete(CourseId)

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
      response
    })
  } catch (error) {
   
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}