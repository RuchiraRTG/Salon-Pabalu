import "./CreatePost.css";
import "./FeedbackHome.css";
import React, { Component } from "react";
import axios from "axios";
import Swal from "sweetalert2"; // Import SweetAlert2
import RatingSelect from "./RatingSelect";
import Feed_Card from "./shared/Feed_Card";

export default class CreatePost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      phone: "",
      email: "",
      courseName: "",
      review: "",
      rating: "",
      courses: [], // Initialize courses array
    };
  }

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  };

  handleRatingChange = (rating) => {
    this.setState({
      rating,
    });
  };

  componentDidMount() {
    this.retrieveCourseNames(); // Fetch course data when the component mounts
  }

  retrieveCourseNames() {
    axios
      .get("http://localhost:5000/courses/courseName") // Adjust URL to your actual API route
      .then((res) => {
        if (res.data.success) {
          this.setState({
            courses: res.data.data, // 'data' contains the course objects
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching course names:", error);
      });
  }

  onSubmit = (e) => {
    e.preventDefault();
    const { name, phone, email, courseName, review, rating } = this.state;

    // Validation checks with SweetAlert2 alerts
    if (!name || !phone || !email || !review || !courseName) {
      Swal.fire({
        icon: "error",
        title: "Missing Fields",
        text: "Please fill in all fields.",
      });
      return;
    }

    if (phone.trim().length !== 10) {
      Swal.fire({
        icon: "error",
        title: "Invalid Phone Number",
        text: "Phone number must be exactly 10 digits.",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Swal.fire({
        icon: "error",
        title: "Invalid Email",
        text: "Please enter a valid email address.",
      });
      return;
    }

    const data = {
      name,
      phone,
      email,
      review,
      rating,
      courseName,
    };

    // Submit the feedback and handle the response
    axios
      .post("http://localhost:5000/feedback/addFeedback", data)
      .then((res) => {
        console.log(res); // Log the response for debugging
        if (res.data.message) {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Course Feedback added successfully.",
          });
          this.setState({
            name: "",
            phone: "",
            email: "",
            review: "",
            rating: "",
            courseName: "",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Submission Failed",
            text: "Submission failed. Please try again.",
          });
        }
      })
      .catch((error) => {
        console.error(
          "Error submitting feedback:",
          error.response ? error.response.data : error.message
        );
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error submitting feedback. Please try again.",
        });
      });
  };

  render() {
    return (
      <div className="createfeedform">
        <Feed_Card>
          <form className="createfeedpost" onSubmit={this.onSubmit}>
            <h2 className="createfeedpost_header">
              How would you rate your service with us?
            </h2>
            <RatingSelect
              select={this.handleRatingChange}
              selected={this.state.rating}
            />

            <div className="createfeedpost_input_group">
              <input
                className="createfeed_input"
                type="text"
                id="name"
                name="name"
                placeholder="Enter your name"
                value={this.state.name}
                onChange={this.handleInputChange}
              />
            </div>
            <br />

            <div className="createfeedpost_input_group">
              <input
                className="createfeed_input"
                type="text"
                id="phone"
                name="phone"
                placeholder="Phone number"
                value={this.state.phone}
                onChange={this.handleInputChange}
              />
            </div>
            <br />

            <div className="createfeedpost_input_group">
              <input
                className="createfeed_input"
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={this.state.email}
                onChange={this.handleInputChange}
              />
            </div>
            <br />

            <div className="createfeedpost_input_group">
              <select
                className="createfeed_input"
                id="courseName"
                name="courseName"
                value={this.state.courseName}
                onChange={this.handleInputChange}
              >
                <option value="" disabled>
                  Select your course
                </option>
                {this.state.courses.map((course) => (
                  <option key={course._id} value={course.name}>
                    {course.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="createfeedpost_input_group">
              <textarea
                className="createfeedpost_input_group_dropdown_txtarea"
                id="review"
                name="review"
                rows="4"
                placeholder="Write your review"
                value={this.state.review}
                onChange={this.handleInputChange}
              ></textarea>
            </div>
            <br />

            <button type="submit" className="btnpostsubmit">
              Submit
            </button>
          </form>
        </Feed_Card>
      </div>
    );
  }
}
