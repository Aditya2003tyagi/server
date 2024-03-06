const mongoose = require("mongoose");

const userSchema = new moongoose.Schema({
    firstName: {
        type:String,
        required:true,
        trim:true,
    },
    lastName: {
        type:String,
        required:true,
        trim:true,
    },
    email: {
        type:String,
        required:true,
        trim:true,
    },
    password: {
        type:String,
        required:true,
    },
    accountType: {
        type: String,
        enum: ["Admin", "Instructor" , "Student"],
        required: true,
    },
    additionalDetails: {
        type:mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"Profile",
    },
    courses:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"CourseProgress",
        }

    ],
    image:{
        type:String,
        required: true,
    },
    token:{
        type: String,
    },
    resertPasswordExpires: {
        type: Date,
    },
    courseProgress: [
        {
            type: moongoose.Schema.Types.ObjectId,
            ref:"CourseProgress"
        }
    ],


    
    

});
module.exports = mongoose.model("User", userSchema);