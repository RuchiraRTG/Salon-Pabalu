import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './AddEmp.css';
import { useAuthToken } from '../../auth';
import { useNavigate } from "react-router-dom";

function AddEmp() {
    const token = useAuthToken();
    const navigate = useNavigate();

    const [empTypeData, setEmpTypeData] = useState([]);
    const [employeeData, setEmployeeData] = useState({
        first_name: '',
        last_name: '',
        mobile_number: '',
        email: '',
        password: '',
        nic: '',
        employee_type: ''
    });

    const [errors, setErrors] = useState({}); 
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEmployeeData({
            ...employeeData,
            [name]: value
        });
    };

    const validateForm = () => {
        const newErrors = {};
        const phonePattern = /^\d{10}$/;
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const namePattern = /^[a-zA-Z]+$/;

        // First Name Validation
        if (!employeeData.first_name) {
            newErrors.first_name = "First Name is required";
        } else if (!namePattern.test(employeeData.first_name)) {
            newErrors.first_name = "First Name must contain only letters";
        }

        // Last Name Validation
        if (!employeeData.last_name) {
            newErrors.last_name = "Last Name is required";
        } else if (!namePattern.test(employeeData.last_name)) {
            newErrors.last_name = "Last Name must contain only letters";
        }

        // Mobile Number Validation
        if (!employeeData.mobile_number) {
            newErrors.mobile_number = "Mobile Number is required";
        } else if (!phonePattern.test(employeeData.mobile_number)) {
            newErrors.mobile_number = "Mobile Number must be a valid 10-digit number";
        }

        // Email Validation
        if (!employeeData.email) {
            newErrors.email = "Email is required";
        } else if (!emailPattern.test(employeeData.email)) {
            newErrors.email = "Invalid email format";
        }

        // Password Validation
        if (!employeeData.password) {
            newErrors.password = "Password is required";
        } else if (employeeData.password.length < 8 ) {
            newErrors.password = "Password must be at least 8 characters long";
        }

        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors); // set the errors if validation fails
        } else {
            setErrors({}); // clear errors if validation passes

            const jsonData = employeeData;

            if (token != null) {
                axios.post("http://localhost:5000/emp/add", { token: token, ...jsonData })
                    .then((response) => {
                        const data = response.data;
                        const status = data.status;
                        if (status === "success") {
                            alert("Employee added");
                            // sendWelcomeEmail(jsonData.email, jsonData.password);
                        } else if (status === "token_expired" || status === "auth_failed") {
                            navigate("/signout");
                        } else {
                            alert("Error - " + data.message);
                        }
                    })
                    .catch((error) => {
                        alert("Error - " + error);
                    });
            } else {
                navigate("/signout");
            }
        }
    };

    useEffect(() => {
        if (token != null) {
            axios.post("http://localhost:5000/emp/etget", { token: token })
                .then((response) => {
                    const data = response.data;
                    if (data.status === "success") {
                        setEmpTypeData(data.data);
                    } else if (data.status === "token_expired" || data.status === "auth_failed") {
                        navigate("/signout");
                    } else {
                        alert("Error - " + data.message);
                    }
                })
                .catch((error) => {
                    alert("Error - " + error);
                });
        } else {
            navigate("/signout");
        }
    }, []);

    return (
        <div className="employee-form-container">
            <h2>Add Employee</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>First Name:</label>
                    <input type="text" name="first_name" value={employeeData.first_name} onChange={handleInputChange} />
                    {errors.first_name && <span className="error-message">{errors.first_name}</span>}
                </div>

                <div>
                    <label>Last Name:</label>
                    <input type="text" name="last_name" value={employeeData.last_name} onChange={handleInputChange} />
                    {errors.last_name && <span className="error-message">{errors.last_name}</span>}
                </div>

                <div>
                    <label>Mobile Number:</label>
                    <input type="text" name="mobile_number" value={employeeData.mobile_number} onChange={handleInputChange} />
                    {errors.mobile_number && <span className="error-message">{errors.mobile_number}</span>}
                </div>

                <div>
                    <label>Email:</label>
                    <input type="email" name="email" value={employeeData.email} onChange={handleInputChange} />
                    {errors.email && <span className="error-message">{errors.email}</span>}
                </div>

                <div>
                    <label>Password:</label>
                    <input type="password" name="password" value={employeeData.password} onChange={handleInputChange} />
                    {errors.password && <span className="error-message">{errors.password}</span>}
                </div>

                <div>
                    <label>NIC:</label>
                    <input type="text" name="nic" value={employeeData.nic} onChange={handleInputChange} />
                </div>

                <div>
                    <label>Employee Type:</label>
                    <select name="employee_type" value={employeeData.employee_type} onChange={handleInputChange}>
                        <option value="">Select Type</option>
                        {empTypeData.map((item) =>
                            <option key={item._id} value={item._id}>{item.type}</option>
                        )}
                    </select>
                </div>

                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default AddEmp;

