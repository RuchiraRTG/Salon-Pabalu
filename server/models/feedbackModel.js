const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true    
    },
    email: {
        type: String,
        required: true
    },
    review: { 
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        default: 10
    },
    courseName: {
        type: String,
        required: true
    },  
    reply: {
        type: String,
        default: ""
    },
    status:{
        type: String,
        default: "Pending"  
    },
    isActive: {
        type: String,
        default: "active"
    }
    
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;
