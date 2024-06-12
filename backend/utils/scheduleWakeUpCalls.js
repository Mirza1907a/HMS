const { sendNotification } = require("../controllers/notificationController");
const WakeUp = require("../models/wakeUpCallModel");

const scheduleWakeUpCalls = async (req, res) => {
  try {
    const now = new Date();

    const nowInPakistan = new Date(
      now.toLocaleString("en-US", { timeZone: "Asia/Karachi" })
    );

    const wakeUpCalls = await WakeUp.find({
      wakeUpDate: {
        $gte: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          0,
          0,
          0
        ),
        $lt: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 1,
          0,
          0,
          0
        ),
      },
      status: { $ne: "completed" },
    });

    if (wakeUpCalls && wakeUpCalls.length === 0) {
      return null;
    }

    for (const wakeUpCall of wakeUpCalls) {
      const [hours, minutes] = wakeUpCall.wakeUpTime.split(":").map(Number);
      if (
        nowInPakistan.getHours() === hours &&
        nowInPakistan.getMinutes() === minutes
      ) {
        await sendNotification(
          req,
          "Wake Up!",
          "Wake Up You Ugly Piece Of Shit!",
          " ",
          "member",
          wakeUpCall.guestId
        );
        await WakeUp.findByIdAndUpdate(wakeUpCall._id, { status: "completed" });
      }
    }
  } catch (err) {
    console.error("Error scheduling wake-up calls:", err);
  }
};

module.exports = { scheduleWakeUpCalls };
