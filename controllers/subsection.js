const SubSection= require("../models/SubSection");
const { findById } = require("../models/course");
const Section=require("../models/section");
const {ImageUploadToCloudinary}= require("../utils/imageuploader");
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
        const {Description,TimeDuration,Title,Sectionid}=req.body;
        const {VideoFile}=req.files;
        if(!Description||!TimeDuration||!Title||!Sectionid)
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

        const SubsectionDetails= await SubSection.create(
            {
                Title,
                TimeDuration,
                Description,
                VideoUrl:response.secure_url,
            }
        );

        const UpdatedSection= await Section.findByIdAndUpdate(Sectionid,
            {
                $push:{SubSection:SubsectionDetails._id}

            },{new:true});
        
            // hw
            // log upadetd section after populate


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
exports.SubsectionUpdate= async (req,res)=>
{
    try {
        const {Description,TimeDuration,Title,Sectionid}=req.body;
    const {VideoFile}=req.files;
    if(!Description||!TimeDuration||!Title||!Sectionid)
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

    const Section_Detailes= await Section.findById(Sectionid);
    const Subsection_Id= Section_Detailes.SubSection;
    const UpdatedSubsectionDetails= await SubSection.findByIdAndUpdate(Subsection_Id,
        {
            Title,
            TimeDuration,
            Description,
            VideoUrl:response.secure_url,
        },
        {new:true}
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

exports.DeteSubsection= async (req,res)=>
{
     try {
         // fetech data
        // data validation
        // delete section
        // return response
        const {SubsectionId}= req.body;
        if(!SubsectionId)
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

    // delete from subsection also


    const Updated_Section= await Section.findByIdAndUpdate(response._id,
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
            SubsectionId

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
