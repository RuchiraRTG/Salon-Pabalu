import { useEffect, useState } from 'react';
import axios from 'axios';
import React from 'react';
import { useNavigate } from "react-router-dom";
import { useAuthToken } from '../../auth';
import './Emp_attendance.css';

function Emp_attendance(){

  const token = useAuthToken();
  const navigate = useNavigate();
  const [employeeData, setEmployeeData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [update, setUpdate] = useState(0);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  useEffect(() => {
    if (token != null) {
      axios.post("http://localhost:5000/emp/get", { token: token }).then((response) => {
        const data = response.data;
        const status = data.status;
        if (status === "success") {
          setEmployeeData(data.data);
        } else if (status === "token_expired" || status === "auth_failed") {
          navigate("/signout");
        } else {
          const message = data.message;
          alert("Error - " + message);
        }
      }).catch((error) => {
        alert("Error - " + error);
      });
    } else {
      navigate("/signout");
    }
  }, [token, update, navigate]);

  // Start attendance
  const startAttendance = (employeeId) => {
    axios.post("http://localhost:5000/emp/atts", { token: token, user_id: employeeId })
      .then((response) => {
        const data = response.data;
        if (data.status === "success") {
          alert("Attendance started successfully");
          setUpdate(update + 1);
        } else {
          alert("Error - " + data.message);
        }
      }).catch((error) => {
        alert("Error - " + error);
      });
  };

  // End attendance
  const endAttendance = (employeeId) => {
    axios.post("http://localhost:5000/emp/atte", { token: token, user_id: employeeId })
      .then((response) => {
        const data = response.data;
        if (data.status === "success") {
          alert("Attendance ended successfully");
          setUpdate(update + 1);
        } else {
          alert("Error - " + data.message);
        }
      }).catch((error) => {
        alert("Error - " + error);
      });
  };

  const sortTable = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = () => {
    if (!sortConfig || !sortConfig.key) return employeeData;

    const sorted = [...employeeData].sort((a, b) => {
      const keyA = sortConfig.key === 'name' ? a.name : a.job_role;
      const keyB = sortConfig.key === 'name' ? b.name : b.job_role;
      if (sortConfig.direction === 'asc') {
        return keyA.localeCompare(keyB);
      }
      if (sortConfig.direction === 'desc') {
        return keyB.localeCompare(keyA);
      }
      return null;
    });
    return sorted;
  };

  const filteredData = () => {
    if (searchText === "") {
      return sortedData();
    } else {
      return sortedData().filter(employee =>
        employee.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }
  };

  return (
    <div className="employee-list-container">
      <h1>Manage Employees Attendance</h1>
      <div className='employee-filter-bar'>
        <input className='employee-filter-search' onChange={(e) => setSearchText(e.target.value)} placeholder="Search employee" type="text" />
        <button className='employee-filter-search-btn' onClick={() => setUpdate(update + 1)}>Search</button>
      </div>
      <table>
        <thead>
          <tr>
            <th onClick={() => sortTable('name')}>Name</th>
            <th onClick={() => sortTable('job_role')}>Job role</th>
            <th>Email</th>
            <th>Start Time</th>
            <th>End Time</th>
          </tr>
        </thead>
        <tbody>
          {filteredData().map((employee, index) => (
            <tr key={index}>
              <td>{employee.name}</td>
              <td>{employee.job_role}</td>
              <td>{employee.email}</td>
              <td>
                <button className='edt_btn' onClick={() => startAttendance(employee.employee_id)}>Start</button>
              </td>
              <td>
                <button className='delete_btn' onClick={() => endAttendance(employee.employee_id)}>End</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Emp_attendance;
