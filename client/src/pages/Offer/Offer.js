import React, { useState, useEffect } from 'react';
import '../Offer/Offer.css'
import axios from 'axios';




function Offer() {
    const [offers, setOffer] = useState([]);
    const [selectedOffer, setSelectedOffer] = useState(null);
  
    useEffect(() => {
      axios.get("http://localhost:5000/offer")
        .then(response => {
          if (Array.isArray(response.data)) {
            //const offer = response.data.filter(offer => offer.sType === 'Offer');
            setOffer(response.data);
          } else {
            console.error("Invalid response data:", response.data);
          }
        })
        .catch(error => {
          console.error("Error fetching offers:", error);
        });
    }, []);
  
    const handleMakeAppointment = (offerId) => {
      // Implement your logic to handle making an appointment
      console.log("Appointment for offer with ID:", offerId);
    };
  
    return (
      <div className="container">
        <p className="service_subtitle">See all the available offers from here</p>
        {offers.map(offer => (
          <div key={offer._id} className='offer-info'>
            <div className='s_image'>
              <img className='offer_details_image' src={"http://localhost:5000/image/" + offer.imageUrl} alt="Offer Image" />
              <div className="offer-name">{offer.sName}</div>
            </div>
            <div className="details">
              <div>
                <p className='offer-n-c'>{offer.sName}<strong>:</strong></p>
              </div>
              <div>
                <p className='offer-desc'>{offer.sDescription}</p>
              </div>
              <div>
                <p className='price'> {offer.sDiscount} %</p>
              </div>
              <div className='button-pos'>
                <button onClick={() => window.location.href='/create-app'} className='offer_app_button'>Make an Appointment</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  export default Offer;
  