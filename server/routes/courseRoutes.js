const express = require('express');
const router = express.Router();

const {
    getAllCourses,
    getCourseById,
    addCourse,
    updateCourse,
    removeCourse,
    getCourseNames
} = require("../controllers/CoursesControllers.js"); // Adjust the path if necessary

// Define the routes
router.get('/allcourses', getAllCourses);
router.post('/course', getCourseById);
router.post('/addcourse', addCourse);
router.put('/updatecourse/:id', updateCourse);
router.post('/removecourse', removeCourse);
router.get('/courseName', getCourseNames);

module.exports = router;
