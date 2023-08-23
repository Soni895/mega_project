const mongoose=require("mongoose");
const CourseSchema=new mongoose.Schema(
    {
        CourseName:
        {
            type:String,
            required:true,
            trim:true,
        },
        CourseDescription:
        {
            type:String,
            required:true,
            trim:true,
        },
        Instructor:
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        WhatYouWillLearn:
         {
            type:String,
            required:true
         },

         CourseContent:
         [
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"Section",
                required:true

            }
         ],
         RatingAndREview:
        [
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"RatingAndREview",
                required:true

            }
        ],
        Price:
        {
            type:Number,
            required:true,
        },  
        Tag:
        {
            type:String,
            required:true
        },

        Thumbnail:

        {
            type:String,
            required:true,
        },
        Category:
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Category",
            required:true

        },
        StudentEnrolled:
        [
            {

                
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
            }
            
        ]

    }
);
const Course=mongoose.model("Course",CourseSchema);
module.exports=Course;