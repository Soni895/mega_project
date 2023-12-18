//  auth
//  isstudent
//  isinstructor
//  isadmin
const jwt = require("jsonwebtoken");
require("dotenv").config();
const jwt_secret = process.env.jwt_secret;
exports.Auth = async (req, res, next) => {
  try {
    console.log("hi inside Auth");

    // extract tooken
    const { Token } =
      req.body ||
      req.cookies ||
      req.header("Authorization").replace("Bearer ", "");

    console.log("Token=>", Token);
    if (!Token) {
      return res.status(500).json({
        status: "unsuccessful",
        success: false,
        error: " token not found",
      });
    }
    //  verify token
    try {
      console.log("jwt_secret=>", jwt_secret);
      // console.log("req.user before=>",req);
      const payload = jwt.verify(Token, jwt_secret);
    
      req.User = payload;
      console.log("payload=>", payload,req.User);
    } catch (error) {
      return res.status(500).json({
        status: "unsuccessful",
        success: false,
        error: " token is invalid",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      status: "unsuccessful",
      success: false,
      error: error,
    });
  }
};
// student authorization
exports.IsStudent = (req, res, next) => {
  try {
    if (req.User.Role !== "Student") {
      return res.status(500).json({
        status: "unsuccessful",
        success: false,
        error: " user not authorize for this role",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      status: "unsuccessful",
      success: false,
      error: error,
    });
  }
};
// Instructor autorization
exports.IsInstructor = (req, res, next) => {
  try {
    if (req.User.Role !== "Instructor") {
      return res.status(500).json({
        status: "unsuccessful",
        success: false,
        error: "user not authorize for this role",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: "unsuccessful",
      success: false,
      error: " token not found",
    });
  }
  next();
};

// is admin autorization

exports.IsAdmin = (req, res, next) => {
  try {
    console.log(req.User.Role);
    if (req.User.Role !== "Admin") {
      return res.status(500).json({
        status: "unsuccessful",
        success: false,
        error: "user not authorize for this role",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: "unsuccessful",
      success: false,
      error: " token not found",
    });
  }
  next();
};
