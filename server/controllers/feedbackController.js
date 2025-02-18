const Feedback = require("../models/feedbackModel"); // Assuming you have saved the model in models folder

const addFeedback = async (req, res) => {
  try {
    const { name, phone, email, service, review, rating, courseName, reply } =
      req.body;
   
    const feedback = new Feedback({
      name,
      phone,
      email,
      service,
      review,
      rating,
      courseName,
      reply,
    });
    const savedFeedback = await feedback.save();
    return res
      .status(201)
      .json({
        message: "Feedback added successfully",
        feedback: savedFeedback,
      });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error adding feedback", error: error.message });
  }
};


const getFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ isActive: { $ne: "Delete" } });
    
    return res.status(200).json({ success: true, feedbacks });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getActiveFeedbacks = async (req, res) => {
  try {

    const feedbacks = await Feedback.find({ 
      status: "Active", 
      isActive: "active" 
    });

    res.status(200).json({
      success: true,
      feedbacks
    });
  } catch (error) {
   
    res.status(500).json({
      success: false,
      message: "Server error. Could not retrieve feedbacks."
    });
  }
};


const getNameAndCourse = async (req, res) => {
  try {
   
    const feedbacks = await Feedback.find({}, 'name courseName'); 

    if (!feedbacks || feedbacks.length === 0) {
      return res.status(404).json({ message: "No feedback found" });
    }

    return res.status(200).json({
      message: "Feedbacks fetched successfully",
      data: feedbacks
    });
  } catch (error) {

    console.error(error);
    return res.status(500).json({
      message: "Server error. Could not retrieve feedbacks.",
    });
  }
};


const updateFeedbackStatus = async (req, res) => {
  try {
    const feedbackId = req.params.id;

    // Find and update the status of the feedback
    const updatedFeedback = await Feedback.findByIdAndUpdate(
      feedbackId,
      { status: 'Active' }, 
      { new: true } 
    );

    if (!updatedFeedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Status updated to Active',
      feedback: updatedFeedback,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Server error. Could not update feedback status.',
      error,
    });
  }
};

const deleteFeedbackStatus = async (req, res) => {
  try {
    const feedbackId = req.params.id;
    const updatedFeedback = await Feedback.findByIdAndUpdate(
      feedbackId,
      { isActive: 'Delete' }, 
      { new: true } 
    );

    if (!updatedFeedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Status updated to Active',
      feedback: updatedFeedback,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Server error. Could not update feedback status.',
      error,
    });
  }
};


module.exports = { addFeedback, getFeedbacks,getNameAndCourse ,updateFeedbackStatus,deleteFeedbackStatus,getActiveFeedbacks };
