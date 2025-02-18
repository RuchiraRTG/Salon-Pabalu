import { useState, useEffect } from 'react';

const useOfferFetcher = (initialOfferType) => {
  const [offers, setOffers] = useState([]);
  const [offerType, setOfferType] = useState(initialOfferType);

  useEffect(() => {
    // Fetch offers based on the offer type
    fetchOffers(offerType);
  }, [offerType]);

  const fetchOffers = async (type) => {
    try {
      const response = await fetch(`http://localhost:5000/api/offer?type=${type}`);
      const data = await response.json();
      setOffers(data);
    } catch (error) {
      console.error('Error fetching offers:', error);
    }
  };

  return { offers, offerType, setOfferType }; // Expose setOfferType function
};

export default useOfferFetcher;
