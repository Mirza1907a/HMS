const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const guestRequestSchema = new Schema(
  {
    guestId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    roomNumber: {
      type: Number,
      required: true,
    },
    bookingId:{
      type: mongoose.Types.ObjectId,
      ref: "Booking",
    },
    seen: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      required: true,
    },
    serviceType: {
      type: String,
      required: true,
    },
    completedBy: {
      type: mongoose.Types.ObjectId,
      ref: "Staff",
    },
    completed: {
      type: Boolean,
      default: false,
    },
    issue: {
      type: String,
      required: true,
    },
    preferredTime: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("guestRequest", guestRequestSchema);
