import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Feed_Card from './shared/Feed_Card';
import RatingSelect from './RatingSelect';

const EditPost = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        service: "",
        review: "",
        rating: ""
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [errors, setFormErrors] = useState({});

    useEffect(() => {
        axios.get(`http://localhost:5000/post/${id}`)
            .then((res) => {
                const postData = res.data.post;
                setFormData({
                    name: postData.name,
                    phone: postData.phone,
                    email: postData.email,
                    service: postData.service,
                    review: postData.review,
                    rating: postData.rating
                });
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching post:', error);
                setError("Error fetching post data.");
            });
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Allow all characters in the phone input
        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleRatingChange = (rating) => {
        setFormData((prevState) => ({
            ...prevState,
            rating
        }));
    };

    const validateForm = () => {
        const { name, phone, email, service, review } = formData;
        const errors = {};
        let isValid = true;

        // Check if name contains only letters (including spaces)
        const nameRegex = /^[A-Za-z\s]+$/;
        if (!name) {
            errors.name = "Name is required";
            isValid = false;
        } else if (!nameRegex.test(name)) {
            errors.name = "Name can only contain letters";
            isValid = false;
        }

        if (!phone) {
            errors.phone = "Phone number is required";
            isValid = false;
        } else if (phone.length !== 10 || !/^\d+$/.test(phone)) {
            errors.phone = "Phone number must be exactly 10 digits";
            isValid = false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            errors.email = "Email is required";
            isValid = false;
        } else if (!emailRegex.test(email)) {
            errors.email = "Please enter a valid email address";
            isValid = false;
        }

        if (!service) {
            errors.service = "Service is required";
            isValid = false;
        }

        // Validate review: can't be only numbers
        if (!review) {
            errors.review = "Review is required";
            isValid = false;
        } else if (/^\d+$/.test(review)) {
            errors.review = "Review cannot contain only numbers";
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    const onSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        axios.put(`http://localhost:5000/post/update/${id}`, formData)
            .then((res) => {
                if (res.data.success) {
                    alert("Feedback updated successfully");
                    navigate(`/contact`);
                }
            })
            .catch((error) => {
                console.error('Error updating feedback:', error);
                alert("Error updating feedback. Please try again.");
            });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
    <div className='FormBG'>
        <div className='createfeedform'>
            <Feed_Card>
                <form className="createfeedpost" onSubmit={onSubmit}>
                    <h2 className='createfeedpost_header'>Edit your feedback</h2>
                    <RatingSelect select={handleRatingChange} selected={formData.rating} />

                    <div className="createfeedpost_input_group">
                        <input
                            className='createfeed_input'
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Enter your name"
                            value={formData.name}
                            onChange={handleInputChange}
                        />
                        {errors.name && <span className="error-text" style={{ color: "red" }}>{errors.name}</span>}
                    </div><br />

                    <div className="createfeedpost_input_group">
                        <input
                            className='createfeed_input'
                            type="text"
                            id="phone"
                            name="phone"
                            placeholder="Phone number"
                            value={formData.phone}
                            onChange={handleInputChange}
                        />
                        {errors.phone && <span className="error-text" style={{ color: "red" }}>{errors.phone}</span>}
                    </div><br />

                    <div className="createfeedpost_input_group">
                        <input
                            className='createfeed_input'
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleInputChange}
                        />
                        {errors.email && <span className="error-text" style={{ color: "red" }}>{errors.email}</span>}
                    </div><br />

                    <div className="createfeedpost_input_group">
                        <select
                            className='createfeedpost_input_group_dropdown'
                            id="service"
                            name="service"
                            value={formData.service}
                            onChange={handleInputChange}
                        >
                            <option value='' disabled>Select a service</option>
                            <option value='Hair Care'>Hair Care</option>
                            <option value='Skin Care'>Skin Care</option>
                            <option value='Nail Care'>Nail Care</option>
                        </select>
                        {errors.service && <span className="error-text" style={{ color: "red" }}>{errors.service}</span>}
                    </div><br />

                    <div className="createfeedpost_input_group">
                        <textarea
                            className="createfeedpost_input_group_dropdown_txtarea"
                            id="review"
                            name="review"
                            rows="4"
                            placeholder="Write your review"
                            value={formData.review}
                            onChange={handleInputChange}
                        ></textarea>
                        {errors.review && <span className="error-text" style={{ color: "red" }}>{errors.review}</span>}
                    </div><br />

                    <button type="submit" className="btnpostsubmit">Submit</button>
                </form>
            </Feed_Card>
        </div>
    </div>
    );
};

export default EditPost;
