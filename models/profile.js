const mongoose=require("mongoose");
const ProfileSchema=new mongoose.Schema(
    {
        Gender:

        {
            type:String,

        },
        DateOfBirth:
        {
            type:String,
        },
        About:
        {
            type:String,
            trim:true,

        },
        ContactNumber:
        {
            type:Number,
            trim:true,

        }

    }
);
const Profile=mongoose.model("Profile",ProfileSchema);
module.exports=Profile;