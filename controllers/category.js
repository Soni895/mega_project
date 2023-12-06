const { validatePaymentVerification } = require("razorpay/dist/utils/razorpay-utils");
const category = require("../models/category");

//    add functionality if category is present dont mkae new category

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
          const IsCategoryPresent= await category.findOne({Name});

          if(IsCategoryPresent)
          {
            return res.status(500).json(
                {
                    status:"successful", 
                    success:true,
                    error:" category exist",
                }); 
          }

          const Category_Deatils= await category.create(
            {
                Name,Description
            }
          );
          console.log(Category_Deatils);
          return res.status(200).json(
            {
                status:true,
                Message: "tag created Successfull",
                Category_Deatils,
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
        const response= await category.find({});
        console.log(response);
        return res.status(200).json({
            Success:true,
            Status:"successful",
            Message:"find All category successful",
            response,
        });

        
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

    const {CategoryId}=req.body;
    const Selectcategory= await category.findById(CategoryId).populate("Course")
    .exec();
    console.log("CategoryId=>",CategoryId,"Selectcategory=>",Selectcategory);

    if(!Selectcategory)
    {
        return res.status(404).json(
            {
                sucecss:true,
                Message:  "data not found",
            }
        )
    }
    
      // get courses for different catagory
  const DifferentCategory = await category.find({
    _id: { $ne: CategoryId }
  }).populate("Course").exec();

      console.log("DifferentCategory=>",DifferentCategory);
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
               Message:"not find course of this category",

            }
          )  
    }
}
