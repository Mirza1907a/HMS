const express = require("express");
const {
  OrderService,
  GetOrderServices,
  getGuestOrderedServices,
} = require("../controllers/serviceOrderController");
const router = express.Router();

router.post("/order-service/:userId/:bookingId", OrderService);

router.get("/GetOrderServices", GetOrderServices);
router.get("/get-your-services/:userId", getGuestOrderedServices);

module.exports = router;
