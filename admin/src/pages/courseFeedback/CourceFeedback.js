import React, { Component, createRef } from "react";
import axios from "axios";
import Swal from "sweetalert2"; // Import SweetAlert2
import "./CourceFeedback.css";

export default class CourceFeedback extends Component {
  constructor(props) {
    super(props);

    this.state = {
      posts: [], // Holds the feedback posts
      replySubmitted: false, // State to track reply submission
      reviewCount: 0, // Total number of reviews
      averageRating: 0, // Average rating of all feedbacks
      hairCareAverageRating: 0, // Average rating for 'Hair Care'
      skinCareAverageRating: 0, // Average rating for 'Skin Care'
      nailCareAverageRating: 0, // Average rating for 'Nail Care'
    };

    this.ComponentsRef = createRef();
  }

  componentDidMount() {
    this.retrievPosts(); // Fetch feedbacks when the component mounts
  }

  retrievPosts() {
    axios.get("http://localhost:5000/feedback/getFeedbacks").then((res) => {
      if (res.data.success) {
        const posts = res.data.feedbacks; // Use 'feedbacks' from the response
        const reviewCount = posts.length; // Calculate total reviews
        const averageRating = this.calculateAverageRating(posts); // Calculate overall average rating

        this.setState({
          posts,
          reviewCount,
          averageRating,
        });
      }
    });
  }

  handleStatusUpdate = (id) => {
    Swal.fire({
      title: "Are you sure you want to update this feedback status to active?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .patch(`http://localhost:5000/feedback/updateFeedback/${id}`) // Triggering the update status API
          .then((res) => {
            if (res.data.success) {
              Swal.fire("Success", "Course feedback status changed to active", "success");
              this.retrievPosts(); // Refresh the feedback list after status change
            } else {
              Swal.fire("Error", "Error updating feedback status", "error");
            }
          })
          .catch((err) => {
            console.error("Error updating status: ", err);
            Swal.fire("Error", "Failed to update feedback status.", "error");
          });
      }
    });
  };

  handleDeleteStatus = (id) => {
    Swal.fire({
      title: "Are you sure you want to delete this course feedback?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .patch(`http://localhost:5000/feedback/deleteFeedback/${id}`)
          .then((res) => {
            if (res.data.success) {
              Swal.fire("Deleted!", "Course feedback deleted successfully", "success");
              this.retrievPosts(); 
            }
          })
          .catch((err) => {
            console.error("Error updating feedback status:", err);
            Swal.fire("Error", "Failed to update status.", "error");
          });
      }
    });
  };

  filterData(posts, searchKey) {
    const result = posts.filter(
      (post) =>
        post.service.toLowerCase().includes(searchKey) ||
        post.name.toLowerCase().includes(searchKey) ||
        post.review.toLowerCase().includes(searchKey) ||
        post.email.toLowerCase().includes(searchKey) ||
        post.reply.toLowerCase().includes(searchKey)
    );

    this.setState({ posts: result });
  }

  handleSearchArea = (e) => {
    const searchKey = e.currentTarget.value;

    axios.get("http://localhost:5000/posts").then((res) => {
      if (res.data.success) {
        this.filterData(res.data.feedbacks, searchKey);
      }
    });
  };

  handlePrint = () => {
    window.print();
    Swal.fire("Success", "Users Report Successfully Downloaded!", "success");
  };

  handleReplySubmitted = () => {
    this.setState({ replySubmitted: true });
  };

  calculateAverageRating(posts) {
    const totalRating = posts.reduce((acc, post) => acc + post.rating, 0);
    return totalRating / (posts.length || 1); // Handle division by zero
  }

  render() {
    return (
      <div className="feed_admincontainer">
        <div className="feed_adminrow">
          <div className="feed_admin_header">
            <h4>All Feedbacks</h4>
            <p>Total Reviews: {this.state.reviewCount}</p>
          </div>

          <div>
            <button
              onClick={this.handlePrint}
              className="feed_admin_dRepo"
              id="feed_admin_genRepo"
            >
              Download Report
            </button>
          </div>

          {/* <div className="col-lg-3" id="feed_admin_genRepo">
            <input
              className="feed_admin_form_control feed_admin_btnsearch"
              type="search"
              placeholder="Search"
              name="searchQuery"
              onChange={this.handleSearchArea}
            />
          </div> */}
        </div>

        <table className="feed_admin_table">
          <thead>
            <tr>
              <th scope="col">#</th>

              <th scope="col">Course Name</th>
              <th scope="col">Rating</th>
              <th scope="col">Customer Name</th>
              <th scope="col">Review</th>
              <th scope="col">Reply</th>
              <th scope="col" id="feed_admin_genRepo">
                Action
              </th>
            </tr>
          </thead>

          <tbody ref={this.ComponentsRef}>
            {this.state.posts.map((post, index) => (
              <tr key={index}>
                <th scope="row">{index + 1}</th>

                <td>{post.courseName}</td>
                <td>{post.rating}</td>
                <td>{post.name}</td>
                <td>{post.review}</td>
                <td>{post.reply || "No reply yet"}</td>
                <td>
                  {post.status === "Pending" ? (
                    <button
                      className="feed_admin_btn_pending"
                      onClick={() => this.handleStatusUpdate(post._id)}
                    >
                      Pending
                    </button>
                  ) : (
                    <button className="feed_admin_btn_active" onClick={() => {
                      Swal.fire("Info", "This feedback is already in active status", "info");
                    }}>
                      {post.status}
                    </button>
                  )}
                  &nbsp;
                  <a
                    className="feed_admin_btn_danger"
                    onClick={() => this.handleDeleteStatus(post._id)}
                  >
                    Delete
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}
