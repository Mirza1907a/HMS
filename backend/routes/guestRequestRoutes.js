const {
  createGuestReq,
  getGuestRequests,
  handleOnTheWay,
  markAsCompleted,
  getRequestsOfGuests,
} = require("../controllers/guestRequestController");
const express = require("express");

const router = express.Router();

router.post("/create-req/:guestId", createGuestReq);
router.get("/get", getGuestRequests);
router.get("/get_guest_requests/:guestId", getRequestsOfGuests);
router.post("/onTheWay/:taskId", handleOnTheWay);
router.patch("/:taskId/mark_as_completed/:staffId", markAsCompleted);

module.exports = router;
