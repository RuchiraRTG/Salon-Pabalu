const mongoose = require("mongoose");
const Course = mongoose.model("Course",{
    id:{
        type: Number,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    newprice:{
        type:Number,
        required:true
    },
    oldprice:{
        type:Number,
        required:true
    },
    duration:{
        type:Number,
        required:true
    },
    shortdescription:{
        type:String,
        required:true
    },
    fulldescription:{
        type:String,
        required:true
    }
})
module.exports = Course;