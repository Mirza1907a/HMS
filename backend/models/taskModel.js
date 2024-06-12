const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    taskId: {
      type: String,
      unique: true
    },
    description: {
      type: String,
      required: true,
    },
    seenBy: [{ type: Schema.Types.ObjectId, ref: "Staff" }],
    deadlineDate: {
      type: Date,
    },
    deadlineTime: {
      type: String,
    },
    preferredTime: {
      type: String,
    },
    wakeUpCallId: {
      type: mongoose.Types.ObjectId,
      ref: 'WakeUpCall'
    },
    assignedTo: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Staff",
      },
    ],
    assignedAll: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Very High"],
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed"],
      default: "Pending",
    },
    completedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

taskSchema.virtual("seenByUsernames", {
  ref: "Staff",
  localField: "seenBy",
  foreignField: "_id",
  justOne: false,
  transform: function (doc, ret) {
    return ret.map((user) => user.username);
  },
});

taskSchema.set("toObject", { virtuals: true });
taskSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Task", taskSchema);
