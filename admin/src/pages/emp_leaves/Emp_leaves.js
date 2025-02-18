import { useEffect, useState } from 'react';
import axios from 'axios';
import React from 'react';
import { useAuthToken } from '../../auth';
import { useNavigate } from "react-router-dom";
import './Emp_leaves.css';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

function Emp_leaves() {
  const token = useAuthToken();
  const navigate = useNavigate();
  const [leaveData, setLeaveData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [update, setUpdate] = useState(0);

  useEffect(() => {
    if (token != null) {
      axios.post("http://localhost:5000/leave/get", { token: token }).then((response) => {
        const data = response.data;
        const status = data.status;
        if (status === "success") {
          setLeaveData(data.data);
        } else if (status === "token_expired" || status === "auth_failed") {
          navigate("/signout");
        } else {
          const message = data.message;
          alert("Error - " + message);
        }
      }).catch((error) => {
        alert("Error 2 - " + error);
      });
    } else {
      navigate("/signout");
    }
  }, [token, navigate, update]);

  const generateReport = () => {
    const doc = new jsPDF();

    doc.setFillColor(0, 0, 0);
    doc.rect(0, 0, doc.internal.pageSize.getWidth(), 20, 'F');
    doc.setFontSize(20);
    doc.setTextColor(255, 204, 0);
    doc.text("Salon  Pabalu", doc.internal.pageSize.getWidth() / 2, 15, 'center');

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.text("Monthly Leave Report", doc.internal.pageSize.getWidth() / 2, 30, 'center');

    const stylistLeaveCount = {};
    leaveData.forEach(leave => {
      const stylistName = `${leave?.user?.first_name || 'Unknown'} ${leave?.user?.last_name || 'User'}`;
      stylistLeaveCount[stylistName] = (stylistLeaveCount[stylistName] || 0) + 1;
    });

    const leaveTable = Object.entries(stylistLeaveCount).map(([stylist, leaves]) => ({ stylist, leaves }));

    const tableStyles = {
      startY: 45,
      headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255] },
      bodyStyles: { textColor: [0, 0, 0] },
      alternateRowStyles: { fillColor: [242, 242, 242], textColor: [0, 0, 0] }
    };

    doc.autoTable({
      head: [['Stylist Name', 'Number of Leaves']],
      body: leaveTable.map(({ stylist, leaves }) => [stylist, leaves]),
      theme: 'striped',
      ...tableStyles
    });

    doc.save('leave_report.pdf');
  };

  const deleteLeave = (leaveId) => {
    if (token != null) {
      axios.post("http://localhost:5000/leave/delete", { token: token, leave_id: leaveId }).then((response) => {
        const data = response.data;
        const status = data.status;

        if (status === "success") {
          alert("Leave request deleted successfully!");
          setUpdate(update + 1); // Refresh the data
        } else if (status === "token_expired" || status === "auth_failed" || status === "access_denied") {
          navigate("/signout");
        } else {
          const message = data.message;
          alert("Error - " + message);
        }
      }).catch((error) => {
        alert("Error 2 - " + error);
      });
    } else {
      navigate("/signout");
    }
  };

  return (
    <div className="employee-list-container">
      <h1>Manage Employee Leaves</h1>

      <div className='employee-filter-bar'>
        <input className='employee-filter-search' onChange={(e) => setSearchText(e.target.value)} placeholder="Search leave" type="text" />
        <button className='employee-filter-search-btn' onClick={() => setUpdate(update + 1)}>Search</button>
        <button className='generate_report_btn' onClick={generateReport}>Generate Report</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Employee Name</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Reason</th>
             
            <th>Reject</th>
          </tr>
        </thead>
        <tbody>
          {leaveData.map((leave, index) => (
            <tr key={index}>
              <td>{leave?.user?.first_name ? `${leave.user.first_name} ${leave.user.last_name}` : 'Unknown User'}</td>
              <td>{leave?.item?.from_date || 'N/A'}</td>
              <td>{leave?.item?.to_date || 'N/A'}</td>
              <td>{leave?.item?.text || 'No Reason Provided'}</td>
              
              <td>
                <button
                  className='delete_btn'
                  onClick={() => deleteLeave(leave.item._id)}>Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Emp_leaves;
