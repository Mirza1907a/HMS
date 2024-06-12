const WakeUp = require("../models/wakeUpCallModel");
const {
  sendNotificationToAdmins,
  sendNotificationToStaff,
  sendNotification,
} = require("./notificationController");
const Task = require("../models/taskModel");
const Staff = require("../models/staffModel");

const ScheduleWakeUpCall = async (req, res) => {
  try {
    const {
      guestId,
      guestName,
      roomNumber,
      wakeUpDate,
      wakeUpTime,
      phoneNumber,
      bookingId
    } = req.body;

    // Create a new wake-up call
    const newWakeUpCall = new WakeUp({
      guestId,
      guestName,
      roomNumber,
      bookingId,
      wakeUpDate,
      wakeUpTime,
      phoneNumber,
      status: "pending",
    });

    const savedWakeUpCall = await newWakeUpCall.save();

    req.io
      .to(req.guestSockets[guestId.toString()])
      .emit("newWakeupCall", savedWakeUpCall);

    const receptionists = await Staff.find({ role: "Receptionist" }).select(
      "_id"
    );
    const receptionistIds = receptionists.map(
      (receptionist) => receptionist._id
    );

    const newTask = new Task({
      title: `Wake Up Call for Room ${roomNumber}`,
      description: `Wake up call for ${guestName} in room ${roomNumber} at ${wakeUpTime} on ${wakeUpDate}.`,
      assignedTo: receptionistIds,
      assignedAll: false,
      deadlineDate: new Date(wakeUpDate),
      deadlineTime: wakeUpTime,
      wakeUpCallId: savedWakeUpCall._id,
      createdBy: guestId,
      priority: "Medium",
      status: "Pending",
    });

    const savedTask = await newTask.save();

    savedWakeUpCall.taskId = newTask._id;

    await savedWakeUpCall.save();

    for (const staff of receptionists) {
      const socketId = req.staffSockets[staff._id.toString()];
      if (socketId) {
        req.io.to(socketId).emit("createTask", savedTask);
      }
    }

    for (const adminSocketId in req.adminSockets) {
      req.io.to(req.adminSockets[adminSocketId]).emit("createTask", savedTask);
    }

    await sendNotificationToAdmins(
      req,
      `A Task has been assigned to Receptionists`,
      newTask.description
    );

    for (const staff of receptionists) {
      await sendNotification(
        req,
        `A Task has been assigned to you from ${guestName}`,
        newTask.description,
        `/task/${newTask._id}`,
        "staff",
        staff._id
      );
    }

    return res.status(201).json({
      success: true,
      wakeUpCall: savedWakeUpCall,
      task: savedTask,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const GetGuestWakeUpCalls = async (req, res) => {
  try {
    const { id } = req.params;

    const WakeUpCalls = await WakeUp.find({ guestId: id });

    if (!id) {
      return res
        .status(404)
        .json({ success: false, message: "Id cannot be null" });
    }
    if (WakeUpCalls.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No Wakeup calls found for the guest!",
      });
    }

    return res.status(200).json({ success: true, wakeUpCalls: WakeUpCalls });
  } catch (err) {
    return res.status(500).json({ success: false, message: err });
  }
};

const CancelWakeUpCall = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedWakeUpCall = await WakeUp.findByIdAndUpdate(
      id,
      { status: "canceled" },
      { new: true }
    );

    if (!updatedWakeUpCall) {
      return res
        .status(404)
        .json({ success: false, message: "Wake-up call not found" });
    }

    const task = await Task.findById(updatedWakeUpCall.taskId);
    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    for (const staff of task.assignedTo) {
      await sendNotification(
        req,
        `Wake-Up Call cancelled`,
        `${updatedWakeUpCall.guestName} cancelled the wake-up call. The task you were assigned to is now deleted!`,
        " ",
        "staff",
        staff
      );

      const StaffIdString = staff._id.toString();
      const socketId = req.staffSockets[StaffIdString];
      if (socketId) {
        req.io.to(socketId).emit("deleteTask", task);
      }
    }

    await sendNotificationToAdmins(
      req,
      `Wake-Up Call cancelled`,
      `${updatedWakeUpCall.guestName} cancelled the wake-up call. The task is now deleted!`
    );

    await task.deleteOne();

    return res.status(200).json({ success: true, data: updatedWakeUpCall });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

module.exports = { ScheduleWakeUpCall, CancelWakeUpCall, GetGuestWakeUpCalls };
