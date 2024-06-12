const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const feedbackSchema = new Schema(
  {
    guestId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    room: { type: Schema.Types.ObjectId, ref: "RoomType", required: true },
    bookingId: { type: Schema.Types.ObjectId, ref: "Booking", required: true },
    rating: { type: Number, required: true },
    body: { type: String, required: true },
    upvotes: {
      type: Number,
      default: 0,
    },
    downvotes: {
      type: Number,
      default: 0,
    },
    upvotedBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    downvotedBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    tags: [{ type: String, default: [] }],
    show: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Feedback", feedbackSchema);
