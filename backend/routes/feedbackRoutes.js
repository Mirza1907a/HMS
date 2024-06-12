const {
  createFeedback,
  voteFeedback,
  getAllFeedback,
  updateStatus,
  getGuestsFeedback,
  getGlobalFeedbacks,
} = require("../controllers/feedbackController");

const express = require("express");

const router = express.Router();

router.post("/create_feedback", createFeedback);
router.get("/get_feedback", getAllFeedback);
router.get("/get_guests_feedback/:guestId", getGuestsFeedback);
router.get("/get_global_feedbacks", getGlobalFeedbacks);

router.get("/get_feedback", getAllFeedback);
router.patch("/vote_feedback", voteFeedback);
router.patch("/update_status/:id", updateStatus);

module.exports = router;
