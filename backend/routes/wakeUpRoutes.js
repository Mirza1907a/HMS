const express = require("express");
const {
  ScheduleWakeUpCall,
  CancelWakeUpCall,
  GetGuestWakeUpCalls,
} = require("../controllers/wakeUpController");

const router = express.Router();

router.post("/schedule-wake-up-call", ScheduleWakeUpCall);
router.get("/get_wakeup_calls/:id",GetGuestWakeUpCalls);
router.put("/cancel-wake-up-call/:id", CancelWakeUpCall);

module.exports = router;
