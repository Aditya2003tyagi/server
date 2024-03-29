const mongoose = require("mongoose");

const courseProgress = new moongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
    },
    completedVideos: [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: "SubSection",
        }

    ]
});
module.exports = mongoose.model("CourseProgress", courseProgress);