const User= require("../models/user");
const Profile= require("../models/profile");
const Course= require("../models/course");
const cron = require('node-cron');
const ImageUploadToCloudinary= require("../utils/imageuploader");
const { promises } = require("nodemailer/lib/xoauth2");
require("dotenv").config();

//   update delete

exports.UpdateProfile= async(req,res)=>
{
    try {
        
        //fetch data from req
        // userid
        //validation
        // find profile
        // update profile
        //return respose

        const {ContactNumber,DateOfBirth="",Gender,About="",FirstName,LastName}=req.body;
        const {id}=req.User;
        console.log(ContactNumber,DateOfBirth,Gender,About,id);
        if(!ContactNumber||!Gender||!id)
        {
            return res.status(401).json(
                {
                    Success:false,
                    status:"unsuccessful",
                    message:"fill all the required filed",
    
                }
            );
        };
        const date = Date.parse(DateOfBirth);
        console.log("date=>",date);

    const UserDetails= await User.findById(id).populate("AdditionalDetails").exec();
        console.log("UserDetailes=>",UserDetails);

        const ProfileId= UserDetails.AdditionalDetails;
        console.log("ProfileId=>",ProfileId);

         const ProfileDetailes= await Profile.findById(ProfileId);
         console.log("ProfileDetailes=>",ProfileDetailes);

        const UpdatedProfile=  await  Profile.findByIdAndUpdate(ProfileId,
            {
                ContactNumber,
                DateOfBirth:date,
                Gender,
                About,
            },{new:true});

            const UpdatedUser= await User.findByIdAndUpdate(UserDetails._id,{FirstName,LastName},{new:true});
            

            console.log("UpdatedProfile  56=>",UpdatedProfile);
            console.log("UpdatedUser 57=>",UpdatedUser);

            return res.status(200).json(
                {
                    status:"successful",
                    message:"Profile updated Successful",
                    ProfileId,
                    UserDetails,
                    ProfileDetailes,
                    UpdatedProfile,
                    UpdatedUser
                }
            );
     
    } catch (error) {
        return res.status(401).json(
            {
                Success:false,
                status:"unsuccessful",
                message:"unable to  Create profile",
                error,
    
            }
        )
    }
}

const delet_User= async(UserDetailes)=>
{
    try {
        console.log("UserDetailes=>",UserDetailes);


         // Delete Assosiated Profile with the User
    // await Profile.findByIdAndDelete({
    //     _id: new mongoose.Types.ObjectId(user.additionalDetails),
    //   });
 
        const ProfileResponse= await Profile.findByIdAndDelete({_id:(UserDetailes.AdditionalDetails)});
        console.log(ProfileResponse);
        for (const courseId of UserDetailes.Courses) {
            console.log(courseId);
           const CourseResponse= await Course.findByIdAndUpdate(
              courseId,
              { $pull: { StudentEnrolled: (UserDetailes._id )} },
              { new: true }
            );
            console.log(CourseResponse);
          }
    
        // delete accout schedule like if we resquest to delete my accout after two or three days 
        // because is their is possibility that user request to delete accout is done by mistake
        
        
        // cron job 
        const DeletedUserResponse= await User.findByIdAndDelete(UserDetailes._id);
                  console.log("Deleted_User=>",DeletedUserResponse);
    
             return[ProfileResponse,DeletedUserResponse];
        
    } catch (error) {
        throw new Error(error,"unable to delete course");
        
    }

    
}


exports.DeleteAccout= async(req,res)=>

{
    try {
        
        // find id 
        // validation
        // delete profile
        // user delete
        // response
        const {Id}=req.body;
        const UserDetailes=await User.findById(Id);

        console.log("Id,UserDetailes=>",Id,"\n",UserDetailes);
        if(!UserDetailes)
        {
            return res.status(404).json(
                {
                    Success:false,
                    status:"unsuccessful",
                    message:"user not found",
    
                }
            );
        }
         // home work  un inroll student from all courses
         

        // const response= await Profile.findByIdAndDelete({_id:UserDetailes.AdditionalDetails});
        // const Deleted_User= await User.findByIdAndDelete(Id);


        //  console.log("response",response);
        //  console.log("Deleted_User=>",Deleted_User);
 
// delete accout schedule like if we resquest to delete my accout after two or three days 
// because is their is possibility that user request to delete accout is done by mistake


// cron job 
   
let  response, Deleted_User;
// [response, Deleted_User] = await delet_User(UserDetailes);

// console.log(response, Deleted_User);

const jobPromise = new Promise(async (resolve, reject) => {
    const scheduledJob = cron.schedule('0 0 * * *', async () => {
        [response, Deleted_User] = await delet_User(UserDetailes);
        console.log("response", response);
        console.log("Deleted_User=>", Deleted_User);
        // resolve(); // Resolve the promise when the job is completed
    });
});
       

    
     console.log("jobPromise=>",jobPromise);
        jobPromise.catch((error)=>
        {
            return res.status(404).json(
                {
                    Success:false,
                    status:"unsuccessful",
                    message:"use not deleted",
                    error
    
                }
            );
        });
        return res.status(200).json({
            status: "scheduled",
            message: "Profile deletion scheduled",
            Id,
            UserDetailes,
            // scheduledJob,
            response,
            Deleted_User,
            // jobPromise
        
        });
      
      

        
    } catch (error) {
        return res.status(401).json(
            {
                Success:false,
                status:"unsuccessful",
                message:"unable to  deleted profile",
                error,
    
            }
        );
        
    }
}


exports.GetallUserDetailes= async (req,res)=>
{
    try {
        const {Id}=req.User;
        const  UserDetailes= await User.findById(Id).populate("AdditionalDetails").exec() ;
        if(!Id)
        {
            return res.status(404).json(
                {
                    Success:false,
                    status:"unsuccessful",
                    message:"Id not found",
    
                }
            );
        }
        return res.status(200).json(
            {
                status:"successful",
                message:" user Profile",
                 UserDetailes,

            }
        );

    } catch (error) {
        return res.status(500).json(
            {
                Success:false,
                status:"unsuccessful",
                message:"unable to  Create profile",
                error,
    
            }
        );
    }
}



// need to think about handler


exports.UpdateDisplayPicture = async (req, res) => {
    try {
      const DisplayPicture = req.files.DisplayPicture
      const userId = req.User.id;
      console.log("User=>",req.User);
      console.log(DisplayPicture);
      console.log(process.env.Folder_name);
      const image = await ImageUploadToCloudinary(
        DisplayPicture,
        process.env.Folder_name,
        1000,
        1000
      );
      console.log("image=>",image);
      const updatedProfile = await User.findByIdAndUpdate(
        { _id: userId },
        { Image: image.secure_url },
        { new: true }
      );
      console.log("updatedProfile=>",updatedProfile);
      res.send({
        success: true,
        message: `Image Updated successfully`,
        data: updatedProfile,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
        error,
      })
    }
};


exports.GetEnrolledCourses = async (req, res) => {
    try {
      const userId = req.user.id
      const userDetails = await User.findOne({
        _id: userId,
      })
        .populate("courses")
        .exec()
      if (!userDetails) {
        return res.status(400).json({
          success: false,
          message: `Could not find user with id: ${userDetails}`,
        })
      }
      return res.status(200).json({
        success: true,
        data: userDetails.courses,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
};


exports.InstructorDashboard= async (req,res)=>
{
    try {
        const courseDetails = await Course.find({ Instructor: req.User.Id })
    
        const courseData = courseDetails.map((course) => {
          const totalStudentsEnrolled = course.StudentEnrolled.length
          const totalAmountGenerated = totalStudentsEnrolled * course.Price
    
          // Create a new object with the additional fields
          const courseDataWithStats = {
            _id: course._id,
            courseName: course.courseName,
            courseDescription: course.courseDescription,
            // Include other course properties as needed
            totalStudentsEnrolled,
            totalAmountGenerated,
          }
    
          return courseDataWithStats
        })
    
        res.status(200).json({ courses: courseData })
      } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Server Error" })
      }

}