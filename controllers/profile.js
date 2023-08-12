const user= require("../models/user");
const profile= require("../models/profile");
const Profile = require("../models/profile");

//   update deelete

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
        const {id}=req.User
        if(!ContactNumber||!Gender||!id);
        {
            return res.status(401).json(
                {
                    Success:false,
                    status:"unsuccessful",
                    message:"fill all the required filed",
    
                }
            )
        };
        const UserDetailes= await user.findById(id);
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


// delete accout schedule like if we resquest to delete my accout after two or three days 
// because is their is possibility that user request to delete accout is done by mistake