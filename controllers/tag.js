const Tag = require("../models/tag");
const tag= require("../models/tag");

exports.CreateTag=async (req,res)=>
{
    try {
        const {Name,Description}=req.body;
          if(!Name||!Description)
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
          console.log(Tag_Deatils);
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

exports.GetAllTag= async (req,res)=>
{
    try {
        const response= await Tag.find({},{name:true,Description:true});
        console.log(response);
        return res.status(200).json({
            Success:true,
            Status:"successful",
            Message:"find All tag successful",
            response,


        })

        
    } catch (error) {
        return res.status(500).json(
            {
                status:false,
                error,
            }
          )
         
    }


}