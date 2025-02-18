import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthToken } from '../../auth';
import { useNavigate } from "react-router-dom";
import './Emp_salary.css';  // Import the external CSS file
import jsPDF from 'jspdf';  // Import jsPDF for PDF generation
import 'jspdf-autotable';  // Import jsPDF autoTable plugin

function Emp_salary() {
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);  // State to store user list
  const [selectedUser, setSelectedUser] = useState("");  // State to store selected user object
  const [day, setDay] = useState(5);  // Dynamic day count
  const token = useAuthToken(); // Get the auth token from the custom hook

  const navigate = useNavigate();

  // Fetch users from the API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.post('http://localhost:5000/emp/get', {
          token,
        });

        if (response.data.status === "success") {
          setUsers(response.data.data);  // Set the user list from the response
        }
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchUsers();
  }, [token]);  // Fetch users when the token changes

  // Fetch salary report when "Get Salary Report" button is clicked
  const fetchSalaryReport = async () => {
    if (!token || !selectedUser || !day) {
      alert("Please select a user and enter a valid day count.");
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/emp/salary', {
        token,
        user_id: selectedUser.employee_id,
        day,
      });

      setReport(response.data);
    } catch (err) {
      setError(err);
      console.error("Error fetching salary report:", err);
    }
  };

  const handleUserChange = (e) => {
    const selectedUserId = e.target.value;
    const user = users.find(user => user.employee_id === selectedUserId);
    setSelectedUser(user);  // Store the selected user object
  };

  const handleDayChange = (e) => {
    setDay(e.target.value);
  };

  const handleFetchReport = () => {
    setReport(null);   
    setError(null);    
    fetchSalaryReport();   
  };

  // Generate a structured PDF from the salary report data
  const generatePDF = () => {
    const doc = new jsPDF();

    // Add header
    doc.setFontSize(30);
    doc.setTextColor(0, 0, 0);  
    doc.setFont("Helvetica", "bold"); 
    doc.text("Salon Pabalu Pay Sheet", doc.internal.pageSize.getWidth() / 2, 20, { align: "center" });
    
    // Reset to normal font for user and date info
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(0); // Reset to black
    doc.text(`Employee Name: ${selectedUser.name}`, 14, 40);
    doc.text(`Total Days: ${report.days}`, 14, 50);
    doc.text(`Total Salary: ${report.total}`, 14, 60);
    
     
    doc.autoTable({
        startY: 70,
        head: [['Date', 'Total Salary', 'Day Salary', 'OT Salary', 'Working Time']],
        body: report.report.map(item => [
            item.date,
            item.total_salary,
            item.day_salary,
            item.ot_salary,
            item.working_time,
        ]),
        styles: {
            fontSize: 12,
            cellPadding: 5,
            lineColor: [0, 0, 0], // Black line color
            lineWidth: 0.5,
        },
        headStyles: {
            fillColor: [200, 200, 200], // Optional: light grey header background
            textColor: [0, 0, 0], // Black text color
            fontStyle: 'bold', // Bold header
        },
        theme: 'striped', // Optional: use striped theme for better readability
    });

    // Save the PDF
    doc.save(`Salary_Report_${selectedUser.name}.pdf`);
};


  if (error) {
    return <div className="error-message">Error fetching salary report: {error.message}</div>;
  }

  return (
    <div className="salary-report-container">
      <h1 className="title">Salary Report</h1>

      {/* User Selection and Input */}
      <div className="input-section">
        <label className="label">
          Select User: 
          <select className="dropdown" value={selectedUser.employee_id || ""} onChange={handleUserChange}>
            <option value="">Select an employee</option>
            {users.map((user) => (
              <option key={user.employee_id} value={user.employee_id}>
                {user.name} - {user.job_role}
              </option>
            ))}
          </select>
        </label>

        <label className="label">
          Day Count: 
          <input 
            className="input" 
            type="number" 
            value={day} 
            onChange={handleDayChange} 
            placeholder="Enter day count" 
            min="1" 
          />
        </label>

        <button className="fetch-button" onClick={handleFetchReport}>Get Salary Report</button>


        {report && (
        <button className="pdf-button" onClick={generatePDF}>Download PDF</button>
      )}
      </div>

      {/* Display loading state if report is being fetched */}
      {!report && !error && <div className="loading-message">Please select a user and click "Get Salary Report".</div>}

      {/* Display report details */}
      {report && (
        <div className="report-section">
          <h2>Total Days: {report.days}</h2>
          <h2>Total Salary: {report.total}</h2>
          <h3>Report Details:</h3>
          <ul className="report-list">
            {report.report.map((item, index) => (
              <li key={index} className="report-item">
                <p>Date: {item.date}</p>
                <p>Total Salary: {item.total_salary}</p>
                <p>Day Salary: {item.day_salary}</p>
                <p>OT Salary: {item.ot_salary}</p>
                <p>Working Time: {item.working_time}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Display the Download PDF button if the report exists */}
      
    </div>
  );
}

export default Emp_salary;
