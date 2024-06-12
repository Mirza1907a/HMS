const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
  },
});

module.exports = mongoose.model("Blog", BlogSchema);
