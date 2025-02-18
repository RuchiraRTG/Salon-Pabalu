import React, { useState, useEffect } from 'react';
import '../ListCourse/Listcourse.css';
import cross_icon from '../../../Assets/cross-button.png';
import edit_icon from '../../../Assets/edit_icon.png';
import { Link } from 'react-router-dom';
import jsPDF from 'jspdf';
import Swal from 'sweetalert2'; // Import SweetAlert2

const Listcourse = () => {
  const [allcourses, setAllcourses] = useState([]);

  const fetchInfo = async () => {
    await fetch('http://localhost:5000/courses/allcourses')
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setAllcourses(data);
      });
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  const remove_course = async (id) => {
    // Use SweetAlert2 to show confirmation dialog
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to delete this course?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then(async (result) => {
      if (result.isConfirmed) {
        // Proceed with deletion if user confirms
        await fetch('http://localhost:5000/courses/removecourse', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: id }),
        });
        // Re-fetch courses after deletion
        await fetchInfo();

        // Show SweetAlert2 success message
        Swal.fire({
          title: 'Deleted!',
          text: 'Course deleted successfully.',
          icon: 'success',
          confirmButtonText: 'OK',
        });
      }
    });
  };

  // Function to generate PDF
  const generatePDF = () => {
    const doc = new jsPDF();

    // Set title of the PDF
    doc.text('Available Course List', 10, 10);

    // Add table headers
    doc.text('Course Name', 10, 30);
    doc.text('Price (Rs)', 60, 30);
    doc.text('Duration (Months)', 110, 30);
    doc.text('Rating', 160, 30);

    // Add each course info
    allcourses.forEach((course, index) => {
      const yPosition = 40 + index * 10; // Y position for each course row
      doc.text(course.name, 10, yPosition);
      doc.text(course.newprice.toString(), 60, yPosition);
      doc.text(course.duration.toString(), 110, yPosition);
      doc.text('5', 160, yPosition); // Assuming rating is always 5
    });

    // Save the generated PDF
    doc.save('Course_List.pdf');
  };

  return (
    <div className='list-course'>
      <h1>All Course List</h1>
      <button className='generate-pdf-btn' onClick={generatePDF}>
        Generate PDF Report
      </button>
      <div className="listcourse-format-main">
        <p>Course</p>
        <p>Course Name</p>
        <p>New Price {"(Rs)"}</p>
        <p>Duration {"(Months)"}</p>
        <p>Rating</p>
        <p>Update</p>
        <p>Remove</p>
      </div>
      <div className="listcourse-allcourse">
        <hr />
        {allcourses.map((course, index) => {
          return (
            <React.Fragment key={index}>
              <div className='listcourse-format-main listcourse-format'>
                <img src={course.image} alt="" className='listcourse-course-icon' />
                <p>{course.name}</p>
                <p>{course.newprice}</p>
                <p>{course.duration}</p>
                <p>5</p>
                <Link to={`/update_cource/${course._id}`}>
                  <img className='listcourse-remove-icon' src={edit_icon} alt="" />
                </Link>
                <img
                  onClick={() => { remove_course(course.id); }}
                  className='listcourse-remove-icon'
                  src={cross_icon}
                  alt=""
                />
              </div>
              <hr />
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default Listcourse;
