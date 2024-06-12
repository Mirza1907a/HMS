const {
  calculateTotalBookingRevenue,
  calculateTotalServiceRevenue,
  calculateTotalRevenue,
} = require("../controllers/analyticsController");
const express = require("express");
const router = express.Router();

router.get("/total_revenue", calculateTotalRevenue);
router.get("/total_booking_revenue", calculateTotalBookingRevenue);

router.get("/total_service_revenue", calculateTotalServiceRevenue);

module.exports = router;
