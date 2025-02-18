const mongoose = require('mongoose');


const enrollSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    mobileNumber: {
        type: String,
        required: true
    },
    nicNumber: {
        type: String,
        required: true
    },
    traineeId: {
        type: String,
        required: true
    },
    course: {
        type: String,
        required: true
    },
    sessionTime: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        default: 'active'
    },
    userId: {
        type: String,
        required: true
    }
});

const Enroll = mongoose.model('Enroll', enrollSchema);

module.exports = Enroll;
