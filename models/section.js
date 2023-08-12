const mongoose=require("mongoose");
const SectionSchema=new mongoose.Schema(
    {
        SectionName:

        {
            type:String,

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
const Section=mongoose.model("Section",SectionSchema);
module.exports=Section;