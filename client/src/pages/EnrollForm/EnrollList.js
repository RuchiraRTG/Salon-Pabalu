import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie'; // For cookie management
import axios from 'axios';
import './EnrollmentStatus.css'; // Import your styles
import CertificateGenerator from './CertificateGenerator';

const EnrollmentStatus = () => {
  const [enrollments, setEnrollments] = useState([]); // State to hold enrollment data
  const [message, setMessage] = useState(""); // State for messages
  const [cookies] = useCookies(["userId"]); // Get userId from cookies

  useEffect(() => {
    if (cookies.userId) {
      fetchEnrollments(cookies.userId);
    } else {
      setMessage("User ID not found in cookies.");
    }
  }, [cookies]);

  const fetchEnrollments = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5000/enrolle/${userId}/status`);
      
      // Check if the status is complete
      if (response.data.status === "complete") {
        // Extract course data from the response
        const courseData = response.data.course; 

    
        setEnrollments([courseData]); 
      } else {
        setMessage("No completed courses found.");
      }
    } catch (error) {
      console.error("Error fetching enrollments:", error);
      setMessage("Failed to load enrollment status.");
    }
  };

  const handleDownload = () => {
    console.log("Downloading certificate...");
  };

  return (
    <div className="enrollment-status">
      <h2>Enrollment Status</h2>
      {message && <div className="message">{message}</div>}
      <ul className="course-list">
        {enrollments.length > 0 ? (
          enrollments.map((course) => (
            <li key={course._id} className="course-item">
              <strong>Course:</strong> {course.name} <br />
              <strong>Status:</strong> <span className="status-complete">Completed</span> <br />
              <strong>Duration:</strong> {course.duration} hours <br />
              <img src={course.image} alt={course.name} className="course-image" />
              <br />
              <strong>Price:</strong> {course.newprice} (Old Price: {course.oldprice}) <br />
              <CertificateGenerator 
                courseName={course.name}
                studentName={cookies.userId} 
                completionDate={new Date().toLocaleDateString()}
              />
            </li>
          ))
        ) : (
          <div>Still Complete Your course.</div>
        )}
      </ul>
    </div>
  );
};

export default EnrollmentStatus;
