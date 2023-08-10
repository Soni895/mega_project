const Tag = require("../models/tag");
const tag= require("../models/tag");

exports.CreateTag=async (req,res)=>
{
    try {
        const {Name,Description}=req.body;
          if(!Name||Description)
          {
            return res.status(500).json(
                {
                    status:"unsuccessful", 
                    success:false,
                    error:" fill all deatiles",
                }); 
          }

          const Tag_Deatils= await Tag.create(
            {
                Name,Description
            }
          );
          return res.status(200).json(
            {
                status:true,
                Message: "tag created Successfull",
                Tag_Deatils,
            }
          );
        
    } catch (error) {
        return res.status(500).json(
            {
                status:false,
                Message: "tag created  Unsuccessfull",
                error,
            }
          )
        
    }
}