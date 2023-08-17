const User= require("../models/user");
const Profile= require("../models/profile");
const cron = require('node-cron');

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

        const {ContactNumber,DateOfBirth="",Gender,About=""}=req.body;
        const {id}=req.User;
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

        const UserDetailes= await User.findById(id);
        cosnole.log(UserDetailes);
        const ProfileId= UserDetailes.AdditionalDetails;
         const ProfileDetailes= await Profile.findById(ProfileId);
        const UpdatedProfile= Profile.findByIdAndUpdate(ProfileId,
            {
                ContactNumber,
                DateOfBirth,
                Gender,
                About,
            },{new:true});

            cosnole.log(UpdatedProfile);

            return res.status(200).json(
                {
                    status:"successful",
                    message:"Profile Created Successful",
                    UserDetailes,
                    ProfileId,
                    UserDetailes,
                    ContactNumber,
                    ProfileDetailes,
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

const delet_User= async()=>
{

    const response= await Profile.findByIdAndDelete({_id:UserDetailes.AdditionalDetails});
 
    // delete accout schedule like if we resquest to delete my accout after two or three days 
    // because is their is possibility that user request to delete accout is done by mistake
    
    
    // cron job 
            const deletd_user= await  User.findByIdAndDelete(
                {
                    _id:id
                }
            ); 
            console.log(`Deleted ${deletd_user.deletedCount} accounts.`);
            return[response,deletd_user];
    
}


exports.DeleteAcout= async(req,res)=>

{
    try {
        
        // find id 
        // validation
        // delete profile
        // user delete
        // response
        const {id}=req.User;
        const UserDetailes=await User.findById(id);
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
 
// delete accout schedule like if we resquest to delete my accout after two or three days 
// because is their is possibility that user request to delete accout is done by mistake


// cron job 
        // const deletd_user= await  User.findByIdAndDelete(
            // {
                // _id:id
            // }
        // ); 

        const [response, deletd_user]=cron.schedule('0 0 * * *',await  delet_User());
         return res.status(200).json(
            {
                status:"successful",
                message:"Profile Created Successful",
                 id,
                 UserDetailes,
                 response,
                 deletd_user
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
        );
        
    }
}


exports.GetallUserDetailes= async (req,res)=>
{
    try {
        const {id}=req.User;
        const  UserDetailes= await User.findById(id).populate("AdditionalDetails").exec();
        if(!id)
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
                 id,
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
      const displayPicture = req.files.displayPicture
      const userId = req.user.id
      const image = await uploadImageToCloudinary(
        displayPicture,
        process.env.FOLDER_NAME,
        1000,
        1000
      )
      console.log(image)
      const updatedProfile = await User.findByIdAndUpdate(
        { _id: userId },
        { image: image.secure_url },
        { new: true }
      )
      res.send({
        success: true,
        message: `Image Updated successfully`,
        data: updatedProfile,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
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