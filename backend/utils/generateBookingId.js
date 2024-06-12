const Booking = require("../models/bookingModel");

const generateBookingId = async () => {
  const prefix = "BOOKING";
  const lettersLength = 3;
  const numbersLength = 3;
  let bookingId;
  let isUnique = false;

  const generateRandomString = (length) => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let randomString = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters.charAt(randomIndex);
    }
    return randomString;
  };

  while (!isUnique) {
    const randomLetters = generateRandomString(lettersLength);
    const randomDigits = Math.floor(Math.random() * 10 ** numbersLength)
      .toString()
      .padStart(numbersLength, "0");
    bookingId = `${prefix}${randomLetters}${randomDigits}`;

    const existingBooking = await Booking.findOne({ bookingId });
    if (!existingBooking) {
      isUnique = true;
    }
  }

  return bookingId;
};

module.exports = generateBookingId;
