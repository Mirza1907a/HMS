const mongoose = require("mongoose");

const MaintenanceSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: Number,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "General Maintenance",
        "Electrical",
        "HVAC",
        "Appliances",
        "Safety and Security",
        "Exterior Issues",
        "Common Areas",
        "Plumbing Specifics",
        "Miscellaneous",
      ],
    },
    issue: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "Pending",
      enum: ["Pending", "In Progress", "Completed"],
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Very High"],
      required: true,
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Maintenance", MaintenanceSchema);
