const SubSection= require("../models/SubSection");
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

// delete subsection