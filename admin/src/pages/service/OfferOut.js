import React, { useState, useEffect } from "react";
import axios from "axios";
// import jsPDF from "jspdf";
import EditOfferForm from "./EditOfferForm";
import "./OfferOut.css"; 
import { generatePDF } from "../service/GeneratePDF";
import Button from "react-bootstrap/Button";
import { IoMdAddCircleOutline } from "react-icons/io";

function OfferList() {
  const [data, setData] = useState([]);
  const [offers, setOffers] = useState([]);
  const [editingOfferId, setEditingOfferId] = useState(null);     
  const [deletingOfferId, setDeletingOfferId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:5000/offer")
      .then((response) => {
        if (Array.isArray(response.data)) {
          setOffers(response.data);
          setData(response.data);
        } else {
          console.error("Invalid response data:", response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching offers:", error);
      });
  }, []);

  const handleEdit = (offerId) => {
    setEditingOfferId(offerId);
  };

  const handleUpdate = (updatedOffer) => {
    axios
      .put(`http://localhost:5000/offer/update/${updatedOffer._id}`, updatedOffer)
      .then((response) => {
        const updatedOffers = offers.map((offer) => {
          if (offer._id === updatedOffer._id) {
            return response.data.offer;
          }
          return offer;
        });
        setOffers(updatedOffers);
        setEditingOfferId(null);
      })
      .catch((error) => {
        console.error("Error updating Offer:", error);
        alert("Error updating offer");
      });
  };

  const handleCancelEdit = () => {
    setEditingOfferId(null); // Cancel editing by setting editingOfferId to null
  };

  const handleDelete = (offerId) => {
    setDeletingOfferId(offerId);
    setShowDeleteModal(true);
  };
                                                  
  const confirmDelete = () => {
    axios
      .delete(`http://localhost:5000/offer/delete/${deletingOfferId}`)
      .then(() => {
        const updatedOffers = offers.filter((offer) => offer._id !== deletingOfferId);
        setOffers(updatedOffers);
        setDeletingOfferId(null);
        setShowDeleteModal(false);
        alert("Offer deleted successfully");
      })
      .catch((error) => {
        console.error("Error deleting offer:", error);
        alert("Error deleting offer");
      });
  };

  const filteredOffers = offers.filter((offer) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    return (
      offer.sName.toLowerCase().includes(lowerCaseSearchTerm) ||
      offer.sType.toLowerCase().includes(lowerCaseSearchTerm) ||
      offer.sDiscount.toString().toLowerCase().includes(lowerCaseSearchTerm)
    );
  });
  // "sType"
  const handleDownloadReport = () => {
    const columns = ["sName", "sDiscount", "createdAt"];        
    const title = "Bidding Report";
    const fileName = "bidding_report";
    const formattedData = filteredOffers.map((offer) => ({
      ...offer,
      createdAt: offer.createdAt.split("T")[0],
    }));
    generatePDF(title, columns, formattedData, fileName);
  };

  const expandDescription = (description) => {
    alert(description);
  };

  return (
    <div className="containerso">
      <h2 className="service_list">Offer List</h2>

      <div className="service-input-group">
  
          <input
            type="text"
            id="searchInput"
            className="service-search-input"
            placeholder="Search by Offer Name, Type, or Price"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button variant="primary" className="service_report" onClick={handleDownloadReport}>
            <IoMdAddCircleOutline className="service_report_button" /> <span>Download Report</span>
          </Button>
      </div>


      <table className="table" style={{ padding: "30px" }}>
        <thead>
          <tr>
            {/* <th>Service Type</th> */}
            <th>Service Name</th>
            <th>Discount</th>
            <th>Date</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredOffers.map((offer) => (
            <tr key={offer._id}>
              {/* <td>{offer.sType}</td> */}
              <td>{offer.sName}</td>
              <td>{offer.sDiscount} % </td>
              <td>{offer.createdAt.split("T")[0]}</td>
              <td>
                {offer.sDescription.length > 30
                  ? offer.sDescription.substring(0, 30) + "..."
                  : offer.sDescription}
              </td>

              <td>
                <button onClick={() => handleEdit(offer._id)} className="btn edit-btn">
                  Edit
                </button>
                <button onClick={() => handleDelete(offer._id)} className="btn delete-btn">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showDeleteModal && (
        <div className="delete-modal">
          <div className="delete-modal-content">
            <p>Are you sure you want to delete this Offer?</p>
            <div>
              <button onClick={confirmDelete} className="btn confirm-delete-btn">
                Confirm Delete
              </button>
              <button onClick={() => setShowDeleteModal(false)} className="btn cancel-delete-btn">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {editingOfferId && (
        <div className="edit-form-modal">
          <div className="edit-form-content">
            <button onClick={handleCancelEdit} className="close-btn">
              &times;
            </button>
            <EditOfferForm
              offer={offers.find((offer) => offer._id === editingOfferId)}
              onUpdate={handleUpdate}
              onCancel={handleCancelEdit} 
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default OfferList;
