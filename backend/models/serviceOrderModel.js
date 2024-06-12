const mongoose = require("mongoose");

const ServiceOrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    required: true,
  },
  description: {
    type: String,
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: true,
  },
  orderDate: { type: Date, default: Date.now },
  quantity: { type: Number, default: 1, required: true },
  cost: { type: Number, required: true },
  status: { type: String, default: "pending" },
});

const ServiceOrder = mongoose.model("ServiceOrder", ServiceOrderSchema);
module.exports = ServiceOrder;
