const express = require('express');
const router = express.Router();
const { createEnrollment, getEnrollments, deleteEnrollStatus, handleDeviceToken, checkCourseStatus } = require('../controllers/enrollController');


router.post('/addEnroll', createEnrollment);
router.get('/getEnroll', getEnrollments);
router.patch('/deleteEnroll/:id', deleteEnrollStatus);  
router.post('/validate',handleDeviceToken); 
router.get('/:userId/status', checkCourseStatus);
module.exports = router;
