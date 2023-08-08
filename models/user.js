const mongoose=require("mongoose");
const UserSchema=new mongoose.Schema(
 
    {
        FirstName:
        {
            type:String,
            required:true,
            trim:true,

        },
        LastName:
        {
            type:String,
            required:true,
            trim:true,

        },
        Email:
        {
            type:String,
            required:true,
         

        },
        AccountType:
        {
            type:String,
            required:true,
           enum: ["Admin","Student","Instructor"],
        },

        AdditionalDetails:
        {
            type:mongoose.Schema.Types.ObjectId,
            required:true,
            ref:"Profile",
        },
        Courses:[
            {
                type:mongoose.Schema.Types.ObjectId,
                required:true,
                ref:"Courses",
            }
        ],
        Image:
        {
            type:String,
            required:true,
        },
        CourseProgrss:
        [
            {
                type:mongoose.Schema.Types.ObjectId,
                required:true,
                ref:"CourseProgress",
                
            }
        ]

    }
);
const user= mongoose.model("User",UserSchema);

module.exports=user;