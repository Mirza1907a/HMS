const Booking = require('../models/bookingModel');

const generateUniqueKey = async () => {
    let uniqueKey;
    let isUnique = false;
  
    while (!isUnique) {
      uniqueKey = Math.floor(100 + Math.random() * 900).toString(); // Generate a random 3-digit number
      const existingBooking = await Booking.findOne({ uniqueKey });
      if (!existingBooking) {
        isUnique = true;
      }
    }
  
    return uniqueKey;
  };

  module.exports = generateUniqueKey
  