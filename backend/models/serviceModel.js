const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const serviceSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  category: {
    type: Schema.Types.ObjectId,
    ref: "ServiceCategory",
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  price: { type: Number, required: true },
  available: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Service", serviceSchema);
