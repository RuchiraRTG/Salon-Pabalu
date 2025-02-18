import React, { useState, useEffect } from 'react'; // Import useEffect
import '../AddCourse/Addcourse.css'
import uploadIcon from '../../../Assets/uploadicon.png'

const Addcourse = () => {
    const [image, setImage] = useState(false);
    const [CourseDetails, setCourseDetails] = useState({
        name: "",
        image: "",
        newprice: "",
        oldprice: "",
        duration: "",
        shortdescription: "",
        fulldescription: ""
    });

    const [popup, setPopup] = useState({ message: "", visible: false, type: "", countdown: 3 }); // Add countdown to state
    const initialCourseState = {
        name: "",
        image: "",
        newprice: "",
        oldprice: "",
        duration: "",
        shortdescription: "",
        fulldescription: ""
    };

    const imageHandler = (e) => {
        setImage(e.target.files[0]);
    };

    const changeHandler = (e) => {
        const { name, value } = e.target;
        setCourseDetails({ ...CourseDetails, [name]: value });


        if (name === 'name') {
            const newValue = value.replace(/[^A-Za-z\s]/g, ""); // Remove any character that is not a letter or space
            setCourseDetails({ ...CourseDetails, [name]: newValue });
        } else {
            setCourseDetails({ ...CourseDetails, [name]: value });
        }


    };

    const Add_course = async () => {
        console.log(CourseDetails);
        let responseData;
        let course = CourseDetails;

        let formData = new FormData();
        formData.append('course', image);

        await fetch('http://localhost:5000/courses/upload', {
            method: 'POST',
            headers: {
                Accept: 'application/json'
            },
            body: formData,
        }).then((resp) => resp.json()).then((data) => { responseData = data });

        if (responseData.success) {
            course.image = responseData.image_url;
            console.log(course);
            await fetch('http://localhost:5000/courses/addcourse', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(course),
            }).then((resp) => resp.json()).then((data) => {
                if (data.success) {
                    showPopup("Course added successfully", "success");
                    setCourseDetails(initialCourseState); // Reset fields after successful addition
                    setImage(false); // Reset the image
                } else {
                    showPopup("Failed to add course", "error");
                }
            });
        }
    };

    const showPopup = (message, type) => {
    setPopup({ message, visible: true, type, countdown: 3 }); // Initialize popup with 3 seconds countdown

    const countdownInterval = setInterval(() => {
        setPopup(prevPopup => {
            if (prevPopup.countdown <= 1) {
                clearInterval(countdownInterval); // Stop countdown when it reaches 0
                return { ...prevPopup, visible: false }; // Hide popup when countdown finishes
            }
            return { ...prevPopup, countdown: prevPopup.countdown - 1 }; // Decrease countdown by 1 second
        });
    }, 1000); // Decrease every second
};
    

    return (
        <div className='add-course'>
            {/* Popup notification */}
            {popup.visible && (
    <div className={`popup ${popup.type}`}>
        {popup.message} ({popup.countdown} seconds)
    </div>
)}
            
            <div className='add-course-itemfields'>
                <p>Course Name</p>
                <input value={CourseDetails.name} onChange={changeHandler} type="text" name='name' placeholder='Type The Course Name'  pattern="[A-Za-z ]"  title="Only letters and spaces are allowed" required />
            </div>

            <div className="course-price">
                <div className='add-course-itemfields'>
                    <p>Price</p>
                    <input value={CourseDetails.oldprice} onChange={changeHandler} type="number" min="0" name='oldprice' placeholder='Type The Old Price' title="Only numbers allowed" required  />
                </div>

                <div className='add-course-itemfields'>
                    <p>Offer Price</p>
                    <input value={CourseDetails.newprice} onChange={changeHandler} type="number" min="0" name='newprice' placeholder='Type The Offer Price' title="Only numbers allowed" required />
                </div>
            </div>

            <div className='add-course-itemfields'>
                <p>Course Duration</p>
                <input value={CourseDetails.duration} onChange={changeHandler} type="number" min="0" name='duration' placeholder='Type The Course Duration'  title="Only numbers allowed" required />
            </div>

            <div className='add-course-itemfields'>
                <p>Short Description</p>
                <textarea value={CourseDetails.shortdescription} onChange={changeHandler} className='textarea1' type="text" name='shortdescription' placeholder='Type The Short Description' />
            </div>

            <div className='add-course-itemfields'>
                <p>Full Description</p>
                <textarea value={CourseDetails.fulldescription} onChange={changeHandler} className='textarea2' type="text" name='fulldescription' placeholder='Type The Full Description' />
            </div>

            <div className='add-course-itemfields'>
                <label htmlFor="file-input">
                    <img src={image ? URL.createObjectURL(image) : uploadIcon} className='addcourse-image' alt="upload area" />
                </label>
                <input onChange={imageHandler} type="file" name="image" id='file-input' hidden />
            </div>

            <button onClick={Add_course} className="add-course-button">Add</button>
        </div>
    )
}

export default Addcourse;
