const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const roomSchema = new Schema(
  {
    adminId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    roomNumber: {
      type: Number,
      required: true,
      unique: true,
    },
    type: {
      type: Schema.Types.ObjectId,
      ref: "RoomType",
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    availibility: {
      type: String,
      enum: ["available", "not available"],
      default: "available",
    },
    status: {
      type: String,
      enum: ["cleaning", "occupied", "maintenance", "vacant"],
      default: "vacant",
    },
    capacity: {
      type: Number,
      required: true,
    },
    pricePerNight: {
      type: Number,
      required: true,
    },
    amenities: {
      type: [String],
    },
    images: [
      {
        filepath: {
          type: String,
        },
      },
    ],
    bookings: [{ type: Schema.Types.ObjectId, ref: "Booking" }],
  },

  { timestamps: true }
);

module.exports = mongoose.model("Room", roomSchema);
