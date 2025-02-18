const Enroll = require("../models/Enroll");
const Course = require("../models/coursesModel");
const Device = require("../models/Device");
const User = require("../models/User"); 
const moment = require('moment');

const handleDeviceToken = async (req, res) => {
  try {
    const { token } = req.body; // The token received from the frontend

    const existingDevice = await Device.findOne({ token });

    if (existingDevice) {
   
      const userId = existingDevice.user_id;

    
      const user = await User.findById(userId);

      if (!user) {
 
        return res.status(404).json({
          message: "User not found",
        });
      }

      
      return res.status(200).json({
        message: "User data retrieved successfully",
        user,
      });
    } else {
     
      return res.status(404).json({
        message: "Token not found",
      });
    }
  } catch (error) {
    console.error("Error handling device token:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


const createEnrollment = async (req, res) => {
  try {
    const {
      fullName,
      email,
      mobileNumber,
      nicNumber,
      traineeId,
      course,
      sessionTime,
      location,
      userId
    } = req.body;

  
    if (
      !fullName ||
      !email ||
      !mobileNumber ||
      !nicNumber ||
      !traineeId ||
      !course ||
      !sessionTime ||
      !location

    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newEnrollment = new Enroll({
      fullName,
      email,
      mobileNumber,
      nicNumber,
      traineeId,
      course,
      sessionTime,
      location,
      userId
    });

    await newEnrollment.save();

    res.status(201).json({
      message: "Enrollment successfully created",
      data: newEnrollment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getEnrollments = async (req, res) => {
  try {
    const enrollments = await Enroll.find({ status: { $ne: "Delete" } });
    res.status(200).json({ success: true, enrollments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteEnrollStatus = async (req, res) => {
  try {
    const enrollId = req.params.id;
    const updatedEntroll = await Enroll.findByIdAndUpdate(
      enrollId,
      { status: "Delete" },
      { new: true }
    );

    if (!updatedEntroll) {
      return res.status(404).json({ message: "entroll not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Status updated to Active",
      updatedEntroll,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error. Could not update feedback status.",
      error,
    });
  }
};

const checkCourseStatus = async (req, res) => {
  try {
    const userId = req.params.userId;

   
    const enrollment = await Enroll.findOne({ userId: userId });

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    const courseId = enrollment.course; 

   
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const courseDuration = course.duration; 

  
    const enrollmentStartDate = moment(enrollment.date); 
    const courseEndDate = enrollmentStartDate.clone().add(courseDuration, 'days'); 

    const currentDate = moment(); 

    
    if (currentDate.isAfter(courseEndDate)) {
      return res.json({ status: 'complete', message: 'Course is complete.',course });
    } else {
      const remainingTime = courseEndDate.diff(currentDate, 'days');  // Calculate remaining time in days
      return res.json({ status: 'ongoing', remainingTime, message: `${remainingTime} days remaining.`,course });
    }

  } catch (error) {
    console.error('Error checking course status:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


module.exports = {
  createEnrollment,
  getEnrollments,
  deleteEnrollStatus,
  handleDeviceToken,
  checkCourseStatus 
};
