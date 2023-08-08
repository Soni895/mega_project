const mongoose=require("mongoose");
const TagSchema=new mongoose.Schema(
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
   
      Course:
      {
        type:mongoose.Schema.Types.ObjectId,
            required:true,
            ref:"Course", 

      }
    }
);
const Tag=mongoose.model("Tag",TagSchema);
module.exports=Tag;