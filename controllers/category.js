const { validatePaymentVerification } = require("razorpay/dist/utils/razorpay-utils");
const Tag = require("../models/tag");
exports.CreateCategory=async (req,res)=>
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

exports.GetAllCategory= async (req,res)=>
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

//  tag page detailes

exports.CategoryPageDetailes= async(req,res)=>
{
    try {
        // get category
    // get all course for specific category id
    // validation
    // get courses for different catagory
    //  gett top selling course

    const {TagId}=req.body;
    const Selectcategory= await Tag.findById(id).populate("Courses")
    .exec();

    if(!Selectcategory)
    {
        return res.status(404).json(
            {
                sucecss:true,
                Message:  "dat anot found",
            }
        )
    }
    
      // get courses for different catagory

      const DifferentCategory= await Tag.find({
        _id:{$ne:TagId}
      }).populate("Course").exec();


    //   gett 10 top selling course   ***********home work************

    return res.status(200).json({
        Success:true,
        Status:"successful",
        DifferentCategory,
        Selectcategory
    })
    } catch (error) {
        return res.status(500).json(
            {
                status:false,
                error,
                Message:error.Message

            }
          )  
    }



}