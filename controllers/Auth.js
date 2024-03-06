const User = require("../models/User");
const OTP = require("..models/OTP");
const OtpGenerator = require("otp- generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
// send otp
exports.sendOTP = async (req, res) =>{
    // fetch email from request ki body
  try{
    const {email} = req.body;

    // check if user already exsists
    const checkUserPresent = await User.findOne({email});
    // if user already exsist return a response
    if(checkUserPresent) {
        return res.status(401).json({
            success: false,
            message: "User already registered"

        })
    }
    // generate an otp
    var otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets : false,
        specialChars: false,
    });
    console.log("OTP generated:", otp);

    // check unique otp or not
    const result = await OTP.findOne({otp: otp});

    while(result){
        otp = otpGenerator(6,{
            upperCaseAlphabets: false,
        lowerCaseAlphabets : false,
        specialChars: false,

        });
        result = await OTP.findOne({otp: otp});
    }

    // creating an entry of otp in database
     const otpPayLoad = {email, otp};
    const otpBody = await OTP.create(otpPayLoad);
    console.log(otpBody);
    // return response successful
    res.status(200).json({
        success: true,
        message: 'OTP sent successfully',
        otp,
    })
  }
  catch(error){
    console.log(error);
    return res.ststus(500).json({
        success: false,
        message:error.message,
    })

  }

};

// Signup
exports.signUp = async(req, res)=>{
    try{
        // data fetch from req body
    const {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        accountType,
        contactNumber,
        otp
    } = req.body;
    // validate karlo
    if(!firstName || !lastName || !email || !password || !confirmPassword || !otp){
        return res.status(403).json({
            success: false,
            message: "All fields are required"
        })
    }
    // 2 password match karlo
    if(password != confirmPassword) {
        return res.status(400).json({
            success: false,
            message: 'Password and confirmPassword value doesnot match, please try again',

        });
    }
    // check user already exsist or not
    const existingUser = await User.findOne({email});
    if(existingUser) {
        return res.status(400).json({
            success: false,
            message: 'User is already registered',
        });
    }
    // find most recent otp stored for the user
    const recentOtp = await Otp.find({email}).sort({createdAt:-1}).limit(1);
    console.log(recentOtp);
    // validate OTP
    if(recentOtp.length == 0){
        // otp not found
        return res.status(400).json({
            success: false,
            message: 'Ottp found',
        })
    }
    else if(otp !== recentOtp.otp){
        // Invalid otp
        return res.status(400).json({
            success: false,
            message: 'Invalid OTP',
        })

    }
    // HASh password
    const hashedPassword = await bcrypt.hash(password, 10);
    // entry create in db
    const profileDetails = await Profile.create({
        gender: null,
        dateofBirth: null,
        about: null,
        contactNumber: null,
    })
    const user = await User.create({
        firstName,
        lastName,
        email,
        contactNumber,
        password:hashedPassword,
        accountType,
        additionalDetails:profileDetails._id,
        image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
    })
    // return res
    return res.status(200).json({
        success: true,
        message:'User is registered successfully',
        user,
    });

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "user cannot be registered. please try again."
        })

    }
    
}

// Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(403).json({
                success: false,
                message: `All fields are required, please try again`
            });
        }

        const user = await User.findOne({ email }).populate("additionalDetails");
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User is not registered, please signup first"
            });
        }
        // generate jwt after password matching.

        if (await bcrypt.compare(password, user.password)) {
            const payload = {
                email: user.email,
                id: user._id,
                accountType: user.accountType,
            };

            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "2h"
            });
            user.token = token;
            user.password = undefined;

            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true
            };

            // set cookie and send response
            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: 'Logged in successfully'
            });
        } else {
            return res.status(401).json({
                success: false,
                message: 'Password is incorrect'
            });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Login failure, please try again'
        });
    }
};