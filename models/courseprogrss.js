const mongoose=require("mongoose");
const CourseProgressSchema= new mongoose.Schema(
    {
        CoursId:
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Course",
             

        },
        UserId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        CompletedVideo:
        [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"SubSection",

        },
    ]
        

    }
);
const CourseProgress=mongoose.model("CourseProgress",CourseProgressSchema);
module.exports=CourseProgress;