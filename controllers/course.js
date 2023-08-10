const { Instructor } = require("../middlewares/auth");
const  Course= require("../models/course");
const Tag=require("../models/tag");
const User=require("../models/user");
const {ImageUploadToCloudinary}=require("../utils/mailsender");
 
// craete Course
// get all caurse

exports.CreateCourse=async(req,res)=>
{
    try {
 
        // data
        // File
        // validation
        // tag
        const {CourseName,CourseDescription,Price,Tag,WhatYouWillLearn}=req.body;
const Thumbnail=req.files.Thumbnail;

//validation
if(!CourseName||!WhatYouWillLearn||!Tag||!Price||!CourseDescription||!Thumbnail)
{
    return res.status(401).json(
        {
            status:"Unsuccessful",
            success:false,
            message:"please fill all the details"
        }
    );
}
// check is instructor
const UserId= req.User.id;
const InstructorDetails=await User.findById(UserId);
console.log(InstructorDetails);
if(!InstructorDetails)
{
    return res.status(401).json(
        {
            status:"Unsuccessful",
            success:false,
            message:"Instrctor detailes not found"
        }
    );
}

// check given tag is valid or not
const  TagDetailes= await Tag.findById(Tag);
if(!TagDetailes)
{
    return res.status(401).json(
        {
            status:"Unsuccessful",
            success:false,
            message:"invalid tag"
        }
    );
}
//  upload image to cloudinary

const ThumbnailImg= await ImageUploadToCloudinary(Thumbnail,process.env.Folder_name);

// create a entry for new course

const NewCourse= await Course.create(
    {
        CourseName,
        CourseDescription,
        Price,
        WhatYouWillLearn,
        Thumbnail:ThumbnailImg.secure_url,
        Instructor:InstructorDetails._id,
        Tag:TagDetailes._id,

    }
    )
// add the new course of user schema of instructor
const response= await User.findByIdAndUpdate({_id:InstructorDetails._id},{
    $push:
    {
        Courses:NewCourse._id,
    }
},{new:true}
)  .populate("courses")
.exec(); 

return res.status(200).json({

    status:successfull,
    message:"course created successful",
    success:true,
    response,
    NewCourse,
    ThumbnailImg,
    CourseName,
    CourseDescription,
    Price,
    Tag,
    WhatYouWillLearn,
    Thumbnail,
    UserId,
    InstructorDetails,
    TagDetailes


})


    } catch (error) {
        return res.status(401).json(
            {
                status:"Unsuccessful",
                success:false,
                message:"course not created please try again",
                error,
            }
        );
        
    }


}