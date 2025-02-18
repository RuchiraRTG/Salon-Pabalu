import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import "../EnrollForm/Enroll.css";
import Swal from 'sweetalert2';

function Enroll() {
  const navigate = useNavigate();
  const [cookies,setCookie] = useCookies(["user_type"]);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    nicNumber: "",
    traineeId: "",
    course: "",
    sessionTime: "",
    location: "",
    userId: "",
  });

  const [message, setMessage] = useState("");
  const [courses, setCourses] = useState([]); // State to hold course options

  // Check for user_type cookie on component mount
  useEffect(() => {
    if (cookies.user_type !== "employee") {
      navigate("/login");
    } else if (cookies.auth_token) {
      validateUser(cookies.auth_token);
    }

    fetchCourses();
  }, [cookies, navigate]);


  const validateUser = async (token) => {
    try {
      const response = await axios.post("http://localhost:5000/enrolle/validate", { token });

      if (response.status === 200) {
        const userData = response.data.user;
        setCookie("userId", userData._id, { path: '/', maxAge: 604800 });
        setFormData({
          fullName: `${userData.first_name} ${userData.last_name}`,
          email: userData.email,
          mobileNumber: userData.mobile_number,
          nicNumber: userData.nic,
          traineeId: "",
          course: "",
          sessionTime: "",
          location: "",
          userId: userData._id,
        });
        setCookie("userId", userData._id, { path: '/', maxAge: 604800 });
      } else {
        setMessage("Unable to retrieve user details.");
      }
    } catch (error) {
      console.error("Error validating user:", error);
      setMessage("Invalid token or server error.");
    }
  };

  // Function to fetch courses
  const fetchCourses = async () => {
    try {
      const response = await axios.get("http://localhost:5000/courses/courseName");
      setCourses(response.data.data); // Assuming the data contains a 'courses' array
    } catch (error) {
      console.error("Error fetching courses:", error);
      setMessage("Failed to load courses. Please try again.");
    }
  };

  // Handle form field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/enrolle/addEnroll", formData);

      // Show success message with SweetAlert
      Swal.fire({
        icon: 'success',
        title: 'Enrollment Successful',
        text: response.data.message || "Enrollment successfully created",
        confirmButtonText: 'OK',
      });
    
      // Reset form data
      setFormData({
        fullName: "",
        email: "",
        mobileNumber: "",
        nicNumber: "",
        traineeId: "",
        course: "",
        sessionTime: "",
        location: "",
        userId: "",
      });
      
      setMessage("Enrollment successful!");
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Enrollment Failed',
        text: "Failed to enroll. Please try again.",
        confirmButtonText: 'OK',
      });
    
      setMessage("Failed to enroll. Please try again.");
      console.error("Error submitting form: ", error);
    }
  };

  return (
    <div className="mainPagecontainer">
      <div className="enroll-form-container">
        <h2 className="enrollnowH2">Enroll Now</h2>

        <form className="userDetailsForm" onSubmit={handleSubmit}>
          <fieldset>
            <legend>User Details:</legend>
            <table>
              <tr>
                <td>
                  <label className="Enroll-form-label" htmlFor="fullName">
                    Full Name
                  </label>
                </td>
                <td>
                  <input
                    className="Enroll-form-input"
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label className="Enroll-form-label" htmlFor="email">
                    Email
                  </label>
                </td>
                <td>
                  <input
                    className="Enroll-form-input"
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label className="Enroll-form-label" htmlFor="mobileNumber">
                    Mobile Number
                  </label>
                </td>
                <td>
                  <input
                    className="Enroll-form-input"
                    type="tel"
                    id="mobileNumber"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleInputChange}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label className="Enroll-form-label" htmlFor="nicNumber">
                    NIC Number
                  </label>
                </td>
                <td>
                  <input
                    className="Enroll-form-input"
                    type="text"
                    id="nicNumber"
                    name="nicNumber"
                    value={formData.nicNumber}
                    onChange={handleInputChange}
                    required
                  />
                </td>
              </tr>
            </table>
          </fieldset>

          <br />

          {/* Form for Course Details */}
          <fieldset>
            <legend>Enroll Details</legend>
            <table>
              <tr>
                <td>
                  <label className="Enroll-form-label" htmlFor="traineeId">
                    Trainee Id
                  </label>
                </td>
                <td>
                  <input
                    className="Enroll-form-input"
                    type="text"
                    id="traineeId"
                    name="traineeId"
                    value={formData.traineeId}
                    onChange={handleInputChange}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label className="Enroll-form-label" htmlFor="course">
                    Choose The Course
                  </label>
                </td>
                <td>
                  <select
                    className="Enroll-form-select"
                    id="course"
                    name="course"
                    value={formData.course._id}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select The Course</option>
                    {courses.map((course, index) => (
                      <option key={index} value={course._id}>
                        {course.name}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
              <tr>
                <td>
                  <label className="Enroll-form-label" htmlFor="sessionTime">
                    Session Time
                  </label>
                </td>
                <td>
                  <select
                    className="Enroll-form-select"
                    id="sessionTime"
                    name="sessionTime"
                    value={formData.sessionTime}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Week End or Week Day</option>
                    <option value="Week Day">Week Day</option>
                    <option value="Week End">Week End</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td>
                  <label className="Enroll-form-label" htmlFor="location">
                    Location
                  </label>
                </td>
                <td>
                  <input
                    type="radio"
                    id="Location-mahiyangana"
                    name="location"
                    value="Mahiyanganaya"
                    checked={formData.location === "Mahiyanganaya"}
                    onChange={handleInputChange}
                    required
                  />
                  <label htmlFor="Location-mahiyangana">Mahiyanganaya</label>
                  <br />
                  <input
                    type="radio"
                    id="Location-Bibile"
                    name="location"
                    value="Bibile"
                    checked={formData.location === "Bibile"}
                    onChange={handleInputChange}
                    required
                  />
                  <label htmlFor="Location-Bibile">Bibile</label>
                </td>
              </tr>
            </table>
          </fieldset>

          {/* Submit Button */}
          <div>
            <button className="enroll-button" type="submit">
              Enroll Now
            </button>
          </div>

          {/* Display Success/Error Message */}
          {message && <p>{message}</p>}
        </form>
      </div>
    </div>
  );
}

export default Enroll;
