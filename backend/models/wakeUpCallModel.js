const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WakeUpSchema = new Schema(
  {
    guestId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bookingId: {
      type: mongoose.Types.ObjectId,
      ref: "Booking",
    },
    roomNumber: {
      type: Number,
      required: true,
    },
    guestName: {
      type: String,
      required: true,
    },
    taskId: {
      type: mongoose.Types.ObjectId,
      ref: 'Task'
    },
    wakeUpDate: {
      type: Date,
      required: true,
    },
    wakeUpTime: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "canceled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("WakeUpCall", WakeUpSchema);
