import React, { useState } from "react";
import axios from "axios";
import "./EditOfferForm.css"; // Import your CSS file

function EditOfferForm({ offer, onUpdate, onCancel }) {
    const [editedOffer, setEditedOffer] = useState(offer);

    const handleChange = (e) => {
        const { name, value } = e.target;  
        setEditedOffer({ ...editedOffer, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.put(`http://localhost:5000/offer/update/${editedOffer._id}`, editedOffer)
            .then(() => {
                onUpdate(editedOffer); // Update offer in parent component
                alert("Offer updated successfully");
            })
            .catch(error => {
                console.error("Error updating offer:", error);
                alert("Error updating offer");
            });
    };

    const handleCancel = (e) => {
        e.preventDefault();
        onCancel(); // Call onCancel function provided by parent component to close the edit form
    };

    return (
        <form onSubmit={handleSubmit} className="edit-service-form">
            {/* <div className="service-form-group">
                <label htmlFor="sType" className="form-label">Service Type</label>
                <input type="text" id="sType" name="sType" className="form-control" value={editedService.sType} onChange={handleChange} />
            </div> */}
            <div className="service-form-group">
                <label htmlFor="sName" className="form-label">Service Name</label>
                <input type="text" id="sName" name="sName" className="form-control" value={editedOffer.sName} onChange={handleChange} />
            </div>
            <div className="service-form-group">
                <label htmlFor="sDiscount" className="form-label">Discount</label>
                <input type="text" id="sDiscount" name="sDiscount" className="form-control" value={editedOffer.sDiscount} onChange={handleChange} />
            </div>
            <div className="service-form-group">
                <label htmlFor="sDescription" className="form-label">Description</label>
                <textarea id="sDescription" name="sDescription" className="form-control" value={editedOffer.sDescription} onChange={handleChange} />
            </div>
            <button type="submit" className="service-btn-primary">Update</button>
            <button onClick={handleCancel} className="service-btn-primary">Cancel</button>
        </form>
    );
}

export default EditOfferForm;
