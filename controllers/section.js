const Course = require("../models/course");
const Section=require("../models/section");


exports.CreateSection= async (req,res)=>
{
 try {
       // 1. fetch data
    //    validation
    //    section craete
    //    upadte in 
    // return response
    const {SectionName,CourseId}=req.body;
    if(!SectionName||!CourseId)
    {
        return res.status(401).json(
            {
                Success:false,
                status:"unsuccessful",
                message:"fill all the required filed",

            }
        )
    }
    const NewSection= await Section.create({
        SectionName,
    });
    const Updated_Course= await  Course.findByIdAndUpdate(CourseId,{

        $push:{CourseContent:NewSection._id}
       
    }, {new:true});


//    add section and sub section  object print populate data visible  home work 

    return res.status(200).json(
        {
            status:"successful",
            message:"Section Created Successful",
            NewSection,
            Updated_Course,
            CourseId,
        }
    );
    
       
 } catch (error) {
    return res.status(401).json(
        {
            Success:false,
            status:"unsuccessful",
            message:"fill all the required filed",
            error,

        }
    )
    
 }}

exports.UpdateSection=async (req,res)=>
{

}
