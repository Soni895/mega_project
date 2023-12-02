const { response } = require('express');

const cloudinary = require('cloudinary').v2

ImageUploadToCloudinary=async (file,folder,height,quality)=>
  {
    console.log("file,folder,height,quality=> 5",file,folder,height,quality);
    const options = { folder }
    if (height) {
      options.height = height
    }
    if (quality) {
      options.quality = quality
    }
    options.resource_type = "auto"
    console.log("OPTIONS", options);
       const response = await cloudinary.uploader.upload(file.tempFilePath,options);
          console.log("response=>",response);
          return response;

}

module.exports= ImageUploadToCloudinary;
