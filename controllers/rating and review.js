// create ratig
// get rating
// get all rating
  const RatingAndREview= require("../models/ratingandreview");
  const Course= require("../models/course");
const { default: mongoose } = require("mongoose");

  exports.Createrating= async (req,res)=>
  {
    try {
        // get user id
        // fetch  data from req body
        // check is user is enroll or not
        // check already review and rating
        // create RatingAndREview
        // update course with this
        // return  response
        const UserId= req.User.id;
        const {rating,Review,CourseId}= req.body;
        const CourseDetailes= await Course.findOne({_id:CourseId,
        StudentEnrolled:{$elemMatch:{$eq:UserId}}
                                                  });

    if(!CourseDetailes)
    {
       
                return res.status(404).json(
                    {
                        status:"Unsuccessful",
                        success:false,
                        
                        message:"Course and user not found",
                    }
                )   
    }

    const ISAlreadyReviewed= RatingAndREview.findOne(
        {
            User:UserId,
            Course:CourseId,
        }
    )
     
    if(ISAlreadyReviewed)
    {
        return res.status(404).json(
            {
                status:"Unsuccessful",
                success:false,
           
                message:"Course is alraedy review by user ",
            }
        )  
    }

    const response= await  RatingAndREview.create(
        {
            Rating,
            Review,
            USer:UserId,

        }
    );
    const Updated_Course=  await Course.findByIdAndUpdate({
        _id:UserId
    },
    {
    $push:{RatingAndREview:response._id}
    },{new :true});
    
    return res.status(200).json(
        {
            Success:true,
            message:"rating and review successful Created",
            response,
            Updated_Course


        }
    )

    } 
    catch (error) {
        return res.status(500).json(
            {
                Staus:false,
                error,
                message:" error in craeting rating and review",
            }
        )
        }
    }

    // get average rating

    exports.GetAverageRating=  async (req,res)=>
    {
        try {
            // get course id
            // calculate average rating
            // return rating

            const {CourseId}=req.body;
            
            const result= await RatingAndREview.aggregate([
                {
                    $match:
                    {
                        Course: new mongoose.Types.ObjectId(CourseId),
                    },

                },
                {
                 $group:
                {
                    _id:null,
                    AverageRating:{$avg:"$Rating"} 

                }
            }
            ]
            );
            if(result.length>0)
            {
                return res.status(200).json(
                    {
                        Success:true,
                        message:"Average rating",
                       AverageRating:result[0].AverageRating,
                       result,
            
            
                    }
                )
            }
        
            return res.status(200).json(
                {
                    Success:true,
                    message:"Average rating is zer0",
                   AverageRating:0,
                   result,
        
        
                }
            )
            


        } catch (error) {
            return res.status(500).json(
                {
                    Staus:false,
                    error,
                    message:" error in craeting rating and review",
                }
            )
            }
        

    }


    exports.GetAllRating= (req,res)=>
    {
        try {
            



        } catch (error) {
            return res.status(500).json(
                {
                    Staus:false,
                    error,
                    message:" error in craeting rating and review",
                }
            )
        }
     }