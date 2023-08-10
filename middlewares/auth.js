//  auth
//  isstudent
//  isinstructor
//  isadmin
const jwt= require("jsonwebtoken");
require("dotenv").config();
const User=require("../models/user");
const  jwt_secret=process.env.jwt_secret;
exports.Auth=async (req,res,next)=>
{
    try {
        
// extract tooken
const {Token}=req.body||req.cookies ||
 req.header("Authorization").replace("Bearer ","");

 if(!Token)
 {
     return res.status(500).json(
         {
             status:"unsuccessful",
             success:false,
             error:" token not found",
         });
 }
//  verify token
try {
    const payload=jwt.verify(Token,jwt_secret);
    req.user=payload;
    
} catch (error) {
    return res.status(500).json(
        {
            status:"unsuccessful",
            success:false,
            error:" token is invalid",
        });
}
  next();
    } catch (error) {
        return res.status(500).json(
            {
                status:"unsuccessful",
                success:false,
                error:error,
            });
        
    }

}
// student authorization
exports.IsStudent=(req,res,next)=>
{
    try {
    
        if(req.user.AccountType!=="Student")
        {
                return res.status(500).json(
                    {
                        status:"unsuccessful",
                        success:false,
                        error:" user not authorize for this role",
                    });
                    next();
        }
        
    } catch (error) {
        return res.status(500).json(
            {
                status:"unsuccessful",
                success:false,
                error:error,
            });
        
    }
   

}
// Instructor autorization
exports.Instructor=(req,res,next)=>
{
    try {
        if(req.user.Role!=="Instructor")
        {
            return res.status(500).json(
                {
                    status:"unsuccessful",
                    success:false,
                    error:"user not authorize for this role",
                });
        }

        
    } catch (error) {
        return res.status(500).json(
            {
                status:"unsuccessful",
                success:false,
                error:" token not found",
            });
        
    }
    next();
}

// is admin autorization

exports.isAdmin=(req,res,next)=>
{
    try {
        if(req.user.Role!=="Admin")
        {
            return res.status(500).json(
                {
                    status:"unsuccessful",
                    success:false,
                    error:"user not authorize for this role",
                });
        }

        
    } catch (error) {
        return res.status(500).json(
            {
                status:"unsuccessful",
                success:false,
                error:" token not found",
            });
        
    }
    next();
}