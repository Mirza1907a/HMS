const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const roomTypeSchema = new Schema(
  {
    type: {
      type: String,
      unique: true,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RoomType", roomTypeSchema);
