import React, { Component } from "react";
import axios from "axios";
import Swal from "sweetalert2"; // Import SweetAlert2
import "./FeedbackHome.css";

export default class EnrollmentList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      enrollments: [],
    };
  }

  componentDidMount() {
    this.retrieveEnrollments();
  }

  retrieveEnrollments() {
    axios.get("http://localhost:5000/enrolle/getEnroll").then((res) => {
      if (res.data.success) {
        this.setState({
          enrollments: res.data.enrollments,
        });
      }
    });
  }

  // Function to delete an enrollment
  handleDeleteEnrollment = (id) => {
    // Use SweetAlert2 for confirmation dialog
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
    }).then((result) => {
      if (result.isConfirmed) {
        // If user confirms, proceed with deletion
        axios
          .patch(`http://localhost:5000/enrolle/deleteEnroll/${id}`)
          .then((res) => {
            if (res.data.success) {
              // Show success alert after deletion
              Swal.fire("Deleted!", "Enrollment details deleted successfully.", "success");
              this.retrieveEnrollments(); // Refresh the list
            } else {
              // Show failure alert
              Swal.fire("Error!", "Failed to delete the enrollment.", "error");
            }
          })
          .catch((err) => {
            console.error("Error deleting enrollment:", err);
            Swal.fire("Error!", "Failed to delete enrollment.", "error");
          });
      }
    });
  };

  render() {
    return (
      <div className="enrollment-container">
        <h4>All Enrollments</h4>

        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Full Name</th>
              <th scope="col">Email</th>
              <th scope="col">Mobile Number</th>
              <th scope="col">NIC Number</th>
              <th scope="col">Trainee ID</th>
              <th scope="col">Course</th>
              <th scope="col">Session Time</th>
              <th scope="col">Location</th>
              <th scope="col">Date</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {this.state.enrollments.map((enrollment, index) => (
              <tr key={index}>
                <th scope="row">{index + 1}</th>
                <td>{enrollment.fullName}</td>
                <td>{enrollment.email}</td>
                <td>{enrollment.mobileNumber}</td>
                <td>{enrollment.nicNumber}</td>
                <td>{enrollment.traineeId}</td>
                <td>{enrollment.course}</td>
                <td>{enrollment.sessionTime}</td>
                <td>{enrollment.location}</td>
                <td>{new Date(enrollment.date).toLocaleDateString()}</td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => this.handleDeleteEnrollment(enrollment._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}
