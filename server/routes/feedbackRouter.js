const express = require('express');
const { addFeedback, getFeedbacks, getNameAndCourse, updateFeedbackStatus, deleteFeedbackStatus, getActiveFeedbacks } = require("../controllers/feedbackController");


const router = express.Router();

router.post("/addFeedback",addFeedback);
router.get("/getFeedbacks",getFeedbacks);
router.get("/getNameAndCourse",getNameAndCourse);
router.patch("/updateFeedback/:id",updateFeedbackStatus);
router.patch("/deleteFeedback/:id",deleteFeedbackStatus);
router.get("/getActiveFeedbacks",getActiveFeedbacks);

module.exports = router;