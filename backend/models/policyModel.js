const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PolicySchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  effectiveDate: {
    type: Date,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Draft", "Active", "Archived"],
    required: true,
  },
  createdBy:{
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true
  }
 
},{timestamps: true});

module.exports = mongoose.model("Policy", PolicySchema);
