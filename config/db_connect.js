const mongoose= require("mongoose");
require("dotenv").config();
const url=process.env.db_url;

exports.db_connect=()=>
{
    mongoose.connect(url,
        {
        
            useNewUrlParser: true,
            useUnifiedTopology: true,
  }
    ).then(()=>
    {
        console.log("connection successful");
    }).catch(error=>
        {
            console.log("connection Unsuccessful");
            console.log(error);
            process.exit(1);
        })
}