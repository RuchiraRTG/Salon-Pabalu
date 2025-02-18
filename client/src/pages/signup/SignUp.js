import { useEffect, useState } from "react";
import axios from "axios";
import React from "react";
import { Form, Input } from "antd";
import { Link } from "react-router-dom";
import Swal from "sweetalert2"; // Import SweetAlert2
import "./SignUp.css";
import { useNavigate } from "react-router-dom";

function SignUp() {
  var navigate = useNavigate();

  const onFinish = (values) => {
    axios
      .post("http://localhost:5000/user/register", values)
      .then(function (response) {
        var data = response.data;
        var status = data.status;
        if (status === "success") {
          // Show success alert
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'New user account created successfully.',
            confirmButtonText: 'OK',
          }).then(() => {
            navigate("/login");
          });
        } else {
          // Show error alert with response data
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: JSON.stringify(data),
            confirmButtonText: 'OK',
          });
        }
      })
      .catch(function (error) {
        // Show error alert for request failure
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message,
          confirmButtonText: 'OK',
        });
      });
  };

  const validatePhoneNumber = (rule, value, callback) => {
    const phoneNumberPattern = /^\d{10}$/; // Regular expression for 10-digit phone number // pattern="^07[0-9]{8}$"
    if (!phoneNumberPattern.test(value)) {
      callback("Please enter a valid 10-digit phone number");
    } else {
      callback();
    }
  };

  const validateEmail = (rule, value, callback) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regular expression for email address
    if (!emailPattern.test(value)) {
      callback("Please enter a valid email address");
    } else {
      callback();
    }
  };

  const validatePassword = (rule, value, callback) => {
    if (value && value.length < 4) {
      callback("Password must be at least 4 characters");
    } else {
      callback();
    }
  };

//    const validatePassword = (rule, value, callback) => {
//   // Regular expression for a strong password
//   const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

//   if (!passwordPattern.test(value)) {
//     callback(
//       'Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character'
//     );
//   } else {
//     callback();
//   }
// };


  const validateName = (rule, value, callback) => {
    const namePattern = /^[a-zA-Z]+$/; // Regular expression for letters only
    if (!namePattern.test(value)) {
      callback("Please enter only letters");
    } else {
      callback();
    }
  };

  return (
    <div className="bg-image">
      <div className="authentication">
        <div className="authentication-form card p-2">
          <h1 className="card-title">CREATE AN ACCOUNT</h1>
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item
              label="First Name"
              name="first_name"
              rules={[
                {
                  required: true,
                  message: "Please input your First Name!",
                },
                {
                  validator: validateName,
                },
              ]}
            >
              <Input className="signup_input" placeholder="First Name" />
            </Form.Item>
            <Form.Item
              label="Last Name"
              name="last_name"
              rules={[
                {
                  required: true,
                  message: "Please input your Last Name!",
                },
                {
                  validator: validateName,
                },
              ]}
            >
              <Input className="signup_input" placeholder="Last Name" />
            </Form.Item>
            <Form.Item
              label="Contact Number"
              name="mobile_number"
              rules={[
                {
                  required: true,
                  message: "Please input your Contact Number!",
                },
                {
                  validator: validatePhoneNumber,
                },
              ]}
            >
              <Input className="signup_input" placeholder="Contact Number" />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please input your Email!",
                },
                {
                  validator: validateEmail,
                },
              ]}
            >
              <Input className="signup_input" placeholder="Email" />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your Password!",
                },
                {
                  validator: validatePassword,
                },
              ]}
            >
              <Input.Password
                className="signup_input"
                placeholder="Password"
                type="password"
              />
            </Form.Item>

            <Form.Item
              name="confirm"
              label="Confirm Password"
              dependencies={["password"]}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Please confirm your password!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        "The new password that you entered do not match!"
                      )
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                className="signup_input"
                placeholder="Confirm Password"
                type="password"
              />
            </Form.Item>
            <button className="primary-button" htmltype="submit">
              SIGN UP
            </button>

            <p className="para">
              Already have an account?
              <Link to="/login" className="anchor">
                LOGIN
              </Link>
            </p>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
