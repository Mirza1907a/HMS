const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: "String",
      unique: true,
      required: true,
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    stay: {
      type: Number,
      required: true,
      default: 1,
    },
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: {
      type: String,
    },
    uniqueKey: {
      type: Number,
      unique: true,
      required: true,
    },
    checkInDate: {
      type: Date,
      required: true,
    },
    checkOutDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["booked", "checkedIn", "checkedOut"],
      default: "booked",
    },
    bookedBy: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "bookedByModel",
      required: true,
    },
    bookedByModel: {
      type: String,
      required: true,
      enum: ["Staff", "User"],
    },
    bookingCost: {
      type: Number,
      required: true,
    },
    totalCost: {
      type: Number,
      required: true,
    },
    feedback: {
      type: Boolean,
      default: false,
    },
    paid: {
      type: String,
      enum: ["paid", "not paid"],
      default: "not paid",
    },
    email: {
      type: Boolean,
      default: false,
    },
    serviceOrders: [
      { type: mongoose.Schema.Types.ObjectId, ref: "ServiceOrder" },
    ],
    serviceCost: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
