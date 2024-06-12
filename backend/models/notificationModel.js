const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notificationSchema = new Schema(
  {
    staff: { type: Schema.Types.ObjectId, ref: "Staff" },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    title: { type: String, required: true },
    message: { type: String, required: true },
    seen: { type: Boolean, default: false },
    link: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
