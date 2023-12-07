const SubSection= require("../models/SubSection");
const { findById } = require("../models/course");
const Section=require("../models/section");
const ImageUploadToCloudinary= require("../utils/imageuploader");
require("dotenv").config();
const Folder_name=process.env.Folder_name;


// create subsection
exports.CreateSubsection= async (req,res)=>
{
    try {
        // fetch data from req
        // fetch video/photo from files
        //validation
        // uplaod video upon cloudnary
        //create subsection
        //add subsection id into section 
        // return response
        const {Description,Title,SectionId}=req.body;
        const {VideoFile}=req.files;
        if(!Description||!Title||!SectionId)
        {
            return res.status(401).json(
                {
                    Success:false,
                    status:"unsuccessful",
                    message:"fill all the required filed",
    
                }
            )

        };
        const response= await ImageUploadToCloudinary(VideoFile,Folder_name);
        
        console.log("response inside utility=>",response);

        const SubsectionDetails= await SubSection.create(
            {
                Title,
                TimeDuration:response.duration,
                Description,
                VideoUrl:response.secure_url,
            }
        );
        console.log("SubsectionDetails=>",SubsectionDetails);

        const UpdatedSection= await Section.findByIdAndUpdate(SectionId,
            {
                $push:{SubSection:SubsectionDetails._id}

            },{new:true}).populate("SubSection");
        
            // hw
            // log upadetd section after populate
           console.log("UpdatedSection=>",UpdatedSection);

            return res.status(200).json(
                {
                    status:"successful",
                    message:"Subsection Created Successful",
                    SubsectionDetails,
                    UpdatedSection,
                    response,
                }
            );
        
    } catch (error) {
        return res.status(401).json(
            {
                Success:false,
                status:"unsuccessful",
                message:"unable to  Create Subsection",
                error,
    
            }
        )
        
    }
}


// hw
// upadte subsection 
exports.UpdateSubSection = async (req,res)=>
{
    try {
        const {Description,Title,SectionId,SubSectionId}=req.body;
    console.log(Description,req.files,Title,SectionId,SubSectionId);

   // find updated section and return it
   const Updated_Section = await Section.findById(SectionId).populate("SubSection");
  console.log("Updated_Section =>", Updated_Section);
    const subSection=await SubSection.findById(SubSectionId);
    console.log("subSection=>",subSection);


    if (!subSection) {
        return res.status(404).json({
          success: false,
          message: "SubSection not found",
        })
      }


      
    if (Description !== undefined) {
        subSection.Description = Description
      }

      
    if (Title !== undefined) {
        subSection.Title = Title
      }
  
    // if(!Description||!Title||!SectionId||!SubSectionId)
    // {
    //     return res.status(401).json(
    //         {
    //             Success:false,
    //             status:"unsuccessful",
    //             message:"fill all the required filed",

    //         }
    //     )

    // };

    if (req.files && req.files.VideoFile !== undefined) {
        const {VideoFile}=req.files;
        const response= await ImageUploadToCloudinary(VideoFile,Folder_name);
        subSection.VideoUrl = response.secure_url;
        subSection.TimeDuration = `${response.duration}`;
        console.log("response=>",response);
      }
  

  
const  Updated_Subsection= await subSection.save();
  
console.log("Updated_Subsection=>",Updated_Subsection);
   

  
   
    return res.status(200).json(
        {
            status:"successful",
            message:"SubSection Updated Successful",
            Updated_Subsection,
            Updated_Section,
            success:true
        }
    );
    } catch (error) {
        return res.status(500).json({
            error,
            status: "unsuccessful",
            Success:false,
            message:"falid to Update subsection",
        })
    }
}

// delete subsection

exports.DeleteSubsection= async (req,res)=>
{
     try {
         // fetech data
        // data validation
        // delete section
        // return response
        const {SubsectionId,SectionId}= req.body;
        if(!SubsectionId||!SectionId)
        {
        return res.status(401).json(
            {
                Success:false,
                status:"unsuccessful",
                message:" subsection id not found",
            }
        ) ;
        }
        const response= await SubSection.findByIdAndDelete(SubsectionId);

        if(!response)
        {
            return res.status(401).json(
                {
                    Success:false,
                    status:"unsuccessful",
                    message:" subsection id not found",
                }
            ) ;
        }
    // delete from subsection also

      const is_present= await Section.findOne({ SubSection: { $in: [SubsectionId] } });
  console.log("is_present=>",is_present);
      if(!is_present)
      {
        return res.status(401).json(
            {
                Success:false,
                status:"unsuccessful",
                message:" subsection id not found in section array",
            }
        ) ;
      }
    
    const Updated_Section= await Section.findByIdAndUpdate(SectionId,
        {
            $pull:{
                SubSection:SubsectionId,
            }

        },{new:true}
    );


    // return response
    return res.status(200).json(
        {
            staus:"success",
            Success:true,
            message:" sub section Deleted Successfull",
            response,
            Updated_Section,
            SubsectionId,
            is_present

        }
    )


     } catch (error) {
        return res.status(500).json({
            error,
            status: "unsuccessful",
            Success:false,
            message:"falid to delete subsection",
        })
        
     }

}
