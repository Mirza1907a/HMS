const {
  getNotis,
  markSeen,
  markAllNotificationsAsSeen,
  sendNotificationFromAdmin,
} = require("../controllers/notificationController");

const express = require("express");

const router = express.Router();

router.get("/:user/:userId", getNotis);
router.get("/", getNotis);
router.patch("/markSeen/:id", markSeen);
router.put("/mark-all-seen/:userType/:userId", markAllNotificationsAsSeen);
router.post("/create/:adminId", sendNotificationFromAdmin);

module.exports = router;
