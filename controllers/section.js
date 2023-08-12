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
            message:"unable to Create section",
            error,

        }
    )
    
 }}

exports.UpdateSection=async (req,res)=>
{
    try {
        // fetech data
        // data validation
        // update data
        // return response

        const {SectionName,SectionId}=req.body;
        if(!SectionName||!SectionId)
        {
            return res.status(401).json(
                {
                    Success:false,
                    status:"unsuccessful",
                    message:"fill all the required filed",
    
                }
            )

        };

        const Upadted_Section= await Section.findByIdAndUpdate(SectionId,
            {
                SectionName
            },
            {new:true} );

            return res.status(200).json(
                {
                    status:"successful",
                    message:"Section Updated Successful",
                    Upadted_Section,
                    SectionId,
                }
            );
            





        
    } catch (error) {
        return res.status(401).json(
            {
                Success:false,
                status:"unsuccessful",
                message:"unable to  Update section",
                error,
    
            }
        )
        
    }

}

exports.DeleteSection=async (req,res)=>
{
    try {
        // fetech data
        // data validation
        // delete section
        // return response

        const {SectionId}=req.params;
        if(!SectionId)
        {
        return res.status(401).json(
            {
                Success:false,
                status:"unsuccessful",
                message:"unable to  Update section",
            }
        ) 
        }
        const response= await Section.findByIdAndDelete(SectionId);

        // delete section from course mdoel
    
        // const updated_Course= await Course.findByIdAndUpdate(
        //     post_id,{$pull:{comment:deleted_comment._id}},{new :true,} 
        //     );
        return res.status(200).json(
            {
                status:"successful",
                message:"Section Deleted Successful",
                response, 
            }
        );
        
    } catch (error) {
        return res.status(401).json(
            {
                Success:false,
                status:"unsuccessful",
                message:"unable to  Delete section",
                error,
            }
        ) 
        

    }
}