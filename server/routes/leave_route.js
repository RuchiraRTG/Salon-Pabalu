const express = require("express");
const router = express.Router();
const Leave = require("../models/Leave");
const User = require("../models/User");
const mongoose = require('mongoose');

router.route("/add").post((req, res) => {
  const date = new Date();
  const time = date.getTime();

  // Check authentication
  if (req.current_user != null) {
    const userId = req.current_user.user_id;
    const fromDate = req.body.from_date;
    const toDate = req.body.to_date;
    const text = req.body.text;

    // Validate data
    if (!fromDate || !toDate || !text) {
      res.send({ status: "required_failed", message: "Required values are not received." });
      return;
    }

    const leave = new Leave({ user_id: userId, from_date: fromDate, to_date: toDate, text });

    leave.save().then(() => {
      res.send({ status: "success", message: "Item added." });
    });
  } else {
    res.send({ status: "auth_failed", message: "User authentication required." });
  }
});

router.route("/get").post((req, res) => {
  // Check authentication
  if (req.current_user != null) {
    const userType = req.current_user.user.type;

    if (userType == "admin") {
      Leave.find().then(async (doc) => {
        const arr = [];

        for (const item of doc) {
          const userResult = await User.findOne({ _id: item.user_id });
          arr.push({ item, user: userResult });
        }

        res.send({ status: "success", data: arr });
      });
    } else {
      res.send({ status: "access_denied", message: "Cannot access." });
    }
  } else {
    res.send({ status: "auth_failed", message: "User authentication required." });
  }
});

router.route("/delete").post(async (req, res) => {
  // Check authentication
  if (req.current_user != null) {
    const userType = req.current_user.user.type;

    if (userType == "admin") {
      const leaveId = req.body.leave_id;

      // Validate details
      if (!leaveId) {
        res.send({ status: "required_failed", message: "Please provide leave ID." });
        return;
      }

      // Validate leaveId to be a proper ObjectId
      if (!mongoose.Types.ObjectId.isValid(leaveId)) {
        res.send({ status: "invalid_id", message: "Invalid leave ID format." });
        return;
      }

      try {
        // Find and delete leave request
        const result = await Leave.findOneAndDelete({ _id: leaveId });
        if (!result) {
          res.send({ status: "not_found", message: "Leave request not found." });
          return;
        }

        res.send({ status: "success", message: "Leave request deleted." });
      } catch (err) {
        console.error("Error deleting leave request:", err);
        res.status(500).send({ status: "error", message: "Failed to delete leave request.", error: err.message });
      }
    } else {
      res.send({ status: "access_denied", message: "Cannot access." });
    }
  } else {
    res.send({ status: "auth_failed", message: "User authentication required." });
  }
});

module.exports = router;
