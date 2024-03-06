const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = ("../models/User");

// auth
try{
    // extract token
    const token = req.cookies.token || req.body.token || req.header("Authorisation").replaace("Bearer ","");

    // if token is missing then return response
    if(!token){
        return resizeBy.status(401).json({
            success: false,
            message:"Token is missing",
        });
    }
    // verify the token
    try{
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decode);
        req.user = decode;

    }
    catch(err){
        // verification - issue
        return resizeBy.status(401).json({
            success: false,
            message:"token is invalid",
        });

    }
    next();


}
catch(error){
    return res.status(401).json({
        success: false,
        message: 'something went wrong while validating the token',
    });

}

// isstudent
exports.isStudent = async (req,res, next) =>{
    try{
        if(req.user.accountType !== "Student"){
            return res.status(401).json({
                success: false,
                message:'This is the protected routes for students only',
            });
        }
        next();

    }
    catch(error){
        return res.status(500).json({
            success: false,
            message:'User role cannot be verified, please try again'
        })

    }
}

// isInstructor
exports.isInstructor = async (req,res, next) =>{
    try{
        if(req.user.accountType !== "Instructor"){
            return res.status(401).json({
                success: false,
                message:'This is the protected routes for Instructor only',
            });
        }
        next();

    }
    catch(error){
        return res.status(500).json({
            success: false,
            message:'User role cannot be verified, please try again'
        })

    }
}

// isAdmin
exports.isAdmin = async (req,res, next) =>{
    try{
        if(req.user.accountType !== "Admin"){
            return res.status(401).json({
                success: false,
                message:'This is the protected routes for Admin only',
            });
        }
        next();

    }
    catch(error){
        return res.status(500).json({
            success: false,
            message:'User role cannot be verified, please try again'
        })

    }
}