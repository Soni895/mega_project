const { validatePaymentVerification } = require("razorpay/dist/utils/razorpay-utils");
const category = require("../models/category");

//    add functionality if category is present dont mkae new category
function getRandomInt(max) {
    return Math.floor(Math.random() * max)
  }


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
                Message: "category created Successfull",
                Category_Deatils,
            }
          );
        
    } catch (error) {
        return res.status(500).json(
            {
                status:false,
                Message: "Category created  Unsuccessfull",
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

//  category page detailes

exports.CategoryPageDetailes= async(req,res)=>
{
    try {
        // get category
    // get all course for specific category id
    // validation
    // get courses for different catagory
    //  gett top selling course

    const {CategoryId}=req.body;
    const Selectcategory= await category.findById(CategoryId).populate({
        path: "Course",
        match: { Status: "Published" },
        populate: "RatingAndREview",
    })
    .exec();
    console.log("CategoryId=>",CategoryId,"Selectcategory=>",Selectcategory);


    // if category not found
    if(!Selectcategory)
    {
        return res.status(404).json(
            {
                sucecss: false,
                Message:  "Category not found",
            }
        )
    }

   // Handle the case when there are no courses
    if (Selectcategory.Course.length === 0) {
        console.log("No courses found for the selected category.")
        return res.status(404).json({
          success: false,
          message: "No courses found for the selected category.",
        })
      }
    

    
    // get courses for different catagory
  const DifferentCategory = await category.find({
    _id: { $ne: CategoryId }
  }).populate({
    path: "Course",
    match: { Status: "Published" },
    populate: "RatingAndREview",
})
.exec();

      console.log("DifferentCategory=>",DifferentCategory);



      let RandomCategory = await category.findOne(
        DifferentCategory[getRandomInt(DifferentCategory.length)]
          ._id
      ).populate({
        path: "Course",
        match: { Status: "Published" },
        populate: "RatingAndREview",
    })
    .exec();
    //   gett 10 top selling course   ***********home work************

     // Get top-selling courses across all categories
     const AllCategory= await category.find({}).populate({
        path: "Course",
        match: { Status: "Published" },
        populate: "RatingAndREview",
    })
    .exec();

    const AllCourses = AllCategory.flatMap((category) => category.Courses)
    const MostSellingCourses = AllCourses
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 10);

    return res.status(200).json({
        Success:true,
        Status:"successful",
        DifferentCategory,
        Selectcategory,
        RandomCategory,
        AllCourses,
        MostSellingCourses
        
    })
    } catch (error) {
        return res.status(500).json(
            {
                status:false,
                error,
              
               message:error.message

            }
          )  
    }
}
