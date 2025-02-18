const express = require("express");
const router = express.Router();
const Offer = require("../models/Offer");
const multer = require('multer');


const storage = multer.diskStorage({                 
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); 
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage: storage });

router.post('/add', async (req, res) => {
  const { sName, sDiscount, sDescription, sType } = req.body;
  const imageName = req.files[0].filename;
  try {
    const newOffer = new Offer({
      sName,
      sDiscount,
      sDescription,
      sType,
      imageUrl:imageName,
      createdAt: new Date(),
    });

    const savedOffer = await newOffer.save();
    const addedDate = savedOffer.createdAt;

    res.status(200).json({ status: "Offer added", addedDate });
  } catch (error) {
    console.error("Error adding offer:", error);
    res.status(500).json({ status: "Error adding offer", error: error.message });
  }
});

// Read all offers
router.get("/", async (req, res) => {
  try {
    const offers = await Offer.find();
    res.status(200).json(offers);
  } catch (error) {
    console.error("Error fetching offers:", error);
    res.status(500).json({ status: "Error fetching offers", error: error.message });
  }
});

// Read one offer
router.get("/:sid", async (req, res) => {
  const offerId = req.params.sid;

  try {
    const offer = await Offer.findById(offerId);
    if (!offer) {
      res.status(404).json({ status: "Offer not found" });
    } else {
      res.status(200).json(offer);
    }
  } catch (error) {
    console.error("Error fetching offer:", error);
    res.status(500).json({ status: "Error fetching offer", error: error.message });
  }
});

// Update a offer
router.put("/update/:sid", async (req, res) => {
  const offerId = req.params.sid;
  const { sName, sDiscount, sDescription, sType } = req.body;

  const updateOffer= {
    sName,
    sDiscount,
    sDescription,
    sType,
  };

  try {
    const updatedOffer = await Offer.findByIdAndUpdate(offerId, updateOffer, { new: true });
    res.status(200).json({ status: "Offer Updated", offer: updatedOffer });
  } catch (error) {
    console.error("Error updating offer:", error);
    res.status(500).json({ status: "Error with updating offer", error: error.message });
  }
});

// Delete a offer
router.delete("/delete/:sid", async (req, res) => {
  const offerId = req.params.sid;

  try {
    await Offer.findByIdAndDelete(offerId);
    res.status(200).json({ status: "Offer deleted" });
  } catch (error) {
    console.error("Error deleting offer:", error);
    res.status(500).json({ status: "Error with deleting offer", error: error.message });
  }
});

module.exports = router;
