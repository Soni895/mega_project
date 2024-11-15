const mongoose=require("mongoose");
const RatingAndREviewSchema=new mongoose.Schema(
    {
        User:

        {
            type:mongoose.Schema.Types.ObjectId,
            required:true,
            ref:"User", 
        },
      Rating:
      
      {
        type:Number,
        required:true,
      },
      Review:
      {
        type:String,
        required:true

      },
      Course: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Course",
        index: true,
      },
      

    }
);
const RatingAndREview=mongoose.model("RatingAndREview",RatingAndREviewSchema);
module.exports=RatingAndREview;