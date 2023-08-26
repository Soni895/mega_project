const Course = require("../models/course");
const category = require("../models/category");
const User = require("../models/user");
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
      Price,
      Category,
      Tag,
      WhatYouWillLearn,
    } = req.body;
    const Thumbnail = req.files.Thumbnail;

    console.log(
      "CourseName,CourseDescription,Price,Category,WhatYouWillLearn==>",
      CourseName,
      CourseDescription,
      Price,
      Category,
      WhatYouWillLearn
    );

    //validation
    if (
      !CourseName ||
      !WhatYouWillLearn ||
      !Category ||
      !Price ||
      !CourseDescription ||
      !Thumbnail
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

    console.log("InstructorDetails=>", InstructorDetails);

    // verify that serid and instrctor id is same or not ??????????????

    if (!InstructorDetails) {
      return res.status(401).json({
        status: "Unsuccessful",
        success: false,
        message: "Instrctor detailes not found",
      });
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
      Thumbnail,
      process.env.Folder_name
    );
    console.log("ThumbnailImg=>", ThumbnailImg);

    // create a entry for new course

    const NewCourse = await Course.create({
      CourseName,
      CourseDescription,
      Price,
      WhatYouWillLearn,
      Thumbnail: ThumbnailImg.secure_url,
      Instructor: InstructorDetails._id,
      Category: CategoryDetailes._id,
      Tag,
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

exports.ShowAllCourses = async (req, res) => {
  try {
    const AllCourse = await Course.find(
      {},
      {
        CourseName: true,
        Price: true,
        Thumbnail: true,
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
