import { useEffect, useState } from 'react';
import axios from 'axios';
import React from 'react';
import './Profile.css';
import ProfileVector from '../../images/default_profile_vector.webp';
import Camera from '../../images/customer_appointment/camera.png';
import { useAuthToken } from '../../auth';
import { useNavigate } from "react-router-dom";
import PageLoading from '../../components/loading/PageLoading';
import Swal from 'sweetalert2'; // Import SweetAlert2

function Profile() {
    const token = useAuthToken();
    const navigate = useNavigate();
    const [update, setUpdate] = useState(0);
    const [isLoading, setLoading] = useState(true);
    const [profileDetails, setProfileDetails] = useState({});

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");

    var profilePictureUrl = ProfileVector;
    if (profileDetails.profile_pic != null) {
        profilePictureUrl = "http://localhost:5000/image/" + profileDetails.profile_pic;
    }

    useEffect(() => {
        if (token != null) {
            axios.post("http://localhost:5000/user/profile", { token: token }).then((response) => {
                const data = response.data;
                const status = data.status;
                if (status === "success") {
                    setProfileDetails(data);
                    setFirstName(data.first_name);
                    setLastName(data.last_name);
                    setMobileNumber(data.mobile_number);
                    setEmail(data.email);
                    setLoading(false);
                } else if (status === "token_expired" || status === "auth_failed") {
                    navigate("/signout");
                } else {
                    const message = data.message;
                    Swal.fire('Error', message, 'error'); // SweetAlert for error message
                }
            }).catch((error) => {
                Swal.fire('Error', error.message, 'error'); // SweetAlert for API error
            });
        } else {
            navigate("/login");
        }
    }, [update]);

    function deleteProfile(e) {
        e.preventDefault(); // Prevent the default form submission
        Swal.fire({
            title: 'Are you sure?',
            text: "Do you really want to delete your account?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
        }).then((result) => {
            if (result.isConfirmed) {
                setLoading(true);
                axios.post("http://localhost:5000/user/delete", { token: token }).then((response) => {
                    const data = response.data;
                    const status = data.status;
                    if (status === "success") {
                        Swal.fire('Deleted!', 'Your account has been deleted.', 'success'); // SweetAlert for successful deletion
                        navigate("/signout");
                    } else if (status === "token_expired" || status === "auth_failed") {
                        navigate("/signout");
                    } else {
                        const message = data.message;
                        Swal.fire('Error', message, 'error'); // SweetAlert for error
                    }
                }).catch((error) => {
                    Swal.fire('Error', error.message, 'error'); // SweetAlert for API error
                });
            }
        });
    }

    const handleProfilePictureUpload = (e) => {
        const form = new FormData();
        form.append("token", token);
        form.append("image", e);

        axios.post("http://localhost:5000/user/edit/avatar", form).then((response) => {
            const data = response.data;
            const status = data.status;
            if (status === "success") {
                setUpdate(update + 1);
                Swal.fire('Success', 'Profile picture updated successfully.', 'success'); // SweetAlert for success
            } else if (status === "token_expired" || status === "auth_failed") {
                navigate("/signout");
            } else {
                const message = data.message;
                Swal.fire('Error', message, 'error'); // SweetAlert for error
            }
        }).catch((error) => {
            Swal.fire('Error', error.message, 'error'); // SweetAlert for API error
        });
    };

    const editProfile = (e) => {
        e.preventDefault(); // Prevent default form submission
        setLoading(true);
        axios.post("http://localhost:5000/user/edit", { token: token, first_name: firstName, last_name: lastName, email: email, mobile_number: mobileNumber }).then((response) => {
            const data = response.data;
            const status = data.status;

            if (status === "success") {
                Swal.fire('Success', 'Profile details updated successfully.', 'success'); // SweetAlert for success
                setUpdate(update + 1);
            } else if (status === "token_expired" || status === "auth_failed") {
                navigate("/signout");
            } else {
                const message = data.message;
                Swal.fire('Error', message, 'error'); // SweetAlert for error
            }
        }).catch((error) => {
            Swal.fire('Error', error.message, 'error'); // SweetAlert for API error
        });
    };

    if (isLoading) {
        return <PageLoading />;
    } else {
        return (
            <div className='upper-img'>
                <div className='profile-container'>
                    <div className='upper-container'>
                        <div className='image-container'>
                            <img className='profile_img' src={profilePictureUrl} alt="profile" height="100px" width="100px" />
                            <label className='camera-button' htmlFor="file-input">
                                <input id="file-input" type="file" onChange={(e) => handleProfilePictureUpload(e.target.files[0])} style={{ display: "none" }} />
                                <img src={Camera} alt="camera" />
                            </label>
                        </div>
                        <div className='img_text'>
                            <h1 className='pcard-title'>{profileDetails.first_name + " " + profileDetails.last_name}</h1>
                        </div>
                    </div>
                    <div className="lower_pcontainer">
                        <div className="profile_details">
                            <div className="profile_details_form card">
                                <h1 className="card_title">User Information</h1>
                                <form className='profile_form'>
                                    <label>First Name</label>
                                    <input className="profile_input" type="text" onChange={(e) => setFirstName(e.target.value)} placeholder="First Name" defaultValue={profileDetails.first_name} />
                                    <label>Last Name</label>
                                    <input className="profile_input" type="text" onChange={(e) => setLastName(e.target.value)} placeholder="Last Name" defaultValue={profileDetails.last_name} />
                                    <label>Contact Number</label>
                                    <input className="profile_input" type="text" onChange={(e) => setMobileNumber(e.target.value)} placeholder="Contact Number" defaultValue={profileDetails.mobile_number} />
                                    <label>Email</label>
                                    <input className="profile_input" type="email" onChange={(e) => setEmail(e.target.value)} placeholder="Email" defaultValue={profileDetails.email} />
                                    <div className='profile_btn'>
                                        <button className='edit-profile' onClick={editProfile}>Edit Profile</button>
                                        <button className='delete' onClick={deleteProfile}>Delete Account</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Profile;
