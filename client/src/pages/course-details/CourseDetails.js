import '../course-details/CourseDetails.css';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

function CourseDetails() {
    
    const { id } = useParams(); 
    const [coursedetails, setcoursedetails] = useState({});

    // Fetch course details when the component mounts
    useEffect(() => {
        fetch(`http://localhost:5000/courses/course`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id })
        })
        .then(response => response.json())
        .then(data => {
            if (data) {
                setcoursedetails(data);  // Update state with the fetched data
            }
        })
        .catch(error => {
            console.error('Error fetching course details:', error);
        });
    }, [id]);


    return (
        <div className='page-container'>
                    <div className='coursedetails-container' >
                        <div className='image-container1'>
                            <img className='course-details-left-image' src={coursedetails.image} alt='' />
                        </div>
                        <div className='right-container'>
                            <div className='name-and-rating'>
                                <p className='course-name-tag'>{coursedetails.name}</p>
                            </div>
                            <div className='course-price-container'>
                                <p className='new-price-tag'>{"Rs:"}{coursedetails.newprice}</p>
                                <p className='old-price-tag'>{"Rs:"}{coursedetails.oldprice}</p>
                            </div>
                            <div className='description-part'>
                                <p className='full-description-part'>{coursedetails.fulldescription}</p>
                                <p className='instructure-details'>Instructor Mr:Kalpa Malinda</p>
                            </div>
                            <div className='course-details-button-container'>
                                <Link to={`/enroll/${id}`} ><button className='course-details-enroll-button'>Enroll Now</button></Link>    
                                <Link to={`/coursefeedback`}><button className='course-details-enroll-button'>Add Reviw to this course</button></Link>
                         
                            </div>
                        </div>
                    </div>
        </div>
    );
}

export default CourseDetails;
