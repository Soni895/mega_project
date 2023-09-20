const mongoose=require("mongoose");
const CategorySchema=new mongoose.Schema(
    {
        Name:

        {
            type:String,

        },
      Description:
    
        {
            type:String,
            required:true,
             
        },
   
      Course:[
      {
        type:mongoose.Schema.Types.ObjectId,
            required:true,
            ref:"Course", 
      }
    ],
    }
);
const Category=mongoose.model("Category",CategorySchema);
module.exports=Category;