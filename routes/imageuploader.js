const cloudinary = require('cloudinary').v2

exports.ImageUploadToCloudinary=async (file,folder,height,quality)=>
  {
        const option={
            resource_type: 'auto',
            folder,
        };
        if(quality){
            option.quality=quality;
        }
        if(height){
            option.height=height;
        }
 
        return  response = await cloudinary.uploader.upload(file.tempFilePath,option);
    
  
    

}
