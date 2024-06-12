const {
  bookRoom,
  getAllBookings,
  deleteBooking,
  getGuestBooking,
  calculateTotalRevenue,
  bookRoomByGuest,
} = require("../controllers/bookingController");
const express = require("express");

const router = express.Router();

router.post("/:userType/:userId", bookRoom);
router.post("/guestBooking/:userType/:userId", bookRoomByGuest);
router.get("/total-revenue", calculateTotalRevenue);
router.get("/", getAllBookings);
router.get("/:guestId", getGuestBooking);
router.post("/:userType/:userId/deleteBooking", deleteBooking);

module.exports = router;
