const mongoose=require("mongoose");
const SectionSchema=new mongoose.Schema(
    {
        SectionName:

        {
            type:String,
            required:true

        },
      SubSection:
      [
        {
            type:mongoose.Schema.Types.ObjectId,
            required:true,
            ref:"SubSection", 
        }
      ],
  
    }
);
const section=mongoose.model("Section",SectionSchema);
module.exports=section;