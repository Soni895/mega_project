const Course = require("../models/course");
const Section=require("../models/section");
const SubSection= require("../models/SubSection");


exports.CreateSection= async (req,res)=>
{ 
 try {
       // 1. fetch data
    //    validation
    //    section create
    //    upadte in  course
    //    return response
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

    console.log("NewSection=>",NewSection);
    const Updated_Course= await  Course.findByIdAndUpdate(CourseId,{

        $push:{CourseContent:NewSection._id}
    }, {new:true}).populate({
        path: "CourseContent",
        populate: {
            path: "SubSection",
          },
    })
    .exec();


console.log("Updated_Course=>",Updated_Course);
//    add section and sub section  object print populate data visible  home work   **** done******

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
        //delete subsection
        // delete section
        //update course
        // return response

        // const {}=req.params;
        const {CouresId,SectionId}=req.body;
        console.log("SectionId=>",SectionId);
        console.log("CouresId=>",CouresId);
        if(!SectionId||!CouresId)
        {
        return res.status(401).json(
            {
                Success:false,
                status:"unsuccessful",
                message:"unable to  Delete Section ",
            }
        ) 
        }

        const section = await Section.findById(SectionId)
       
        if (!section) {
          return res.status(404).json({
            success: false,
            message: "Section not found",
          })
        }
        // Delete the associated subsections
      const deleted_Subsection= await SubSection.deleteMany({ _id: { $in: section.SubSection } })
        const response= await Section.findByIdAndDelete(SectionId);
        console.log("deleted_Subsection=>",deleted_Subsection);

          if(!response)
          {
            
            return res.status(401).json(
                {
                    Success:false,
                    status:"unsuccessful",
                    message:"section not found ",
                }
            ) 
          }
        
        // delete section from course mdoel   **************hw done*********
       console.log("response=>",response);

       Updated_Course= await Course.findByIdAndUpdate(CouresId,{
        $pull:{
            CourseContent:SectionId
        }

       },{new:true}).populate("CourseContent");
  
            console.log("Updated_Course=>",Updated_Course);

            if(!Updated_Course)
            {
                return res.status(500).json(
                    {
                        message:"course schema not updated"
                    }
                )
            }

        return res.status(200).json(
            {
                status:"successful",
                message:"Section Deleted Successful",
                response, 
                deleted_Subsection,
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