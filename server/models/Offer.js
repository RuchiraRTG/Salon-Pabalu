const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const offerSchema = new Schema({

    sName : {
        type : String,
        required : true 
    },

    sDiscount : {
        type : Number,
        required : true
    },


    sDescription : {
        type : String,
        required : true
    },

    // sType : {
        // type : String,
        // required : true
    // },

    imageUrl: { 
        type: String,
        //required: true,
    },

    createdAt: {
        type: Date,
        default: Date.now
    }


});

const Offer = mongoose.model(`Offer`,offerSchema);

module.exports = Offer;