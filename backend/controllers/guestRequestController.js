const GuestReq = require("../models/guestRequestModel");
const User = require("../models/userModel");
const Staff = require("../models/staffModel");
const {
  sendNotificationToHousekeepers,
  sendNotification,
} = require("./notificationController");

const createGuestReq = async (req, res) => {
  try {
    const { guestId } = req.params;
    const { roomNumber, serviceType, issue, preferredTime, priority,bookingId } =
      req.body;

    const guest = await User.findById(guestId);

    if (!guest) {
      return res.status(404).json({
        success: false,
        message: "No guest found with the provided ID!",
      });
    }

    const guestRequest = await GuestReq.create({
      guestId: guestId,
      roomNumber: roomNumber,
      bookingId: bookingId,
      serviceType: serviceType,
      priority: priority,
      issue: issue,
      preferredTime: preferredTime,
    });

    const populatedGuestRequest = await GuestReq.findById(
      guestRequest._id
    ).populate("guestId");

    const guestIdString = guestId.toString();
    const socketId = req.guestSockets[guestIdString];
    if (socketId) {
      req.io.to(socketId).emit("newGuestTask", populatedGuestRequest);
    } else {
      console.log(`Socket ID not found for staff member with ID: ${guestId}`);
    }

    const staffs = await Staff.find({ role: "Housekeeper" });

    for (const staff of staffs) {
      const staffIdString = staff._id.toString();
      const socketId = req.staffSockets[staffIdString];
      if (socketId) {
        req.io.to(socketId).emit("newGuestTask", populatedGuestRequest);
      } else {
        console.log(
          `Socket ID not found for staff member with ID: ${staff._id}`
        );
      }
    }
    await sendNotificationToHousekeepers(
      req,
      "New Guest Request!",
      `${guest.fullName} has submitted a new request for ${serviceType}. Please attend to it accordingly.`,
      `/tasks/guest/${guestRequest._id}`
    );

    return res.status(201).json({
      success: true,
      message: "Request submitted successfully!",
      request: guestRequest,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

const getRequestsOfGuests = async (req, res) => {
  try {
    const { guestId } = req.params;

    if (!guestId) {
      return res
        .status(404)
        .json({ success: false, message: "No guest found with the provided!" });
    }
    const GuestRequests = await GuestReq.find({ guestId: guestId }).sort({
      createdAt: -1,
    });

    if (!GuestRequests) {
      return res
        .status(404)
        .json({ success: false, message: "No guest requests from the guest!" });
    }

    return res.status(200).json({ success: true, GuestRequests });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error", err: err });
  }
};

const getGuestRequests = async (req, res) => {
  try {
    const guestReq = await GuestReq.find()
      .populate("guestId")
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, guestRequests: guestReq });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: err });
  }
};
const handleOnTheWay = async (req, res) => {
  try {
    const { taskId } = req.params;

    const markedGuestReq = await GuestReq.findById(taskId);

    if (markedGuestReq.seen) {
      return res.status(409).json({
        success: false,
        message: "Task already marked as 'on the way'",
      });
    }

    (markedGuestReq.seen = true), await markedGuestReq.save();

    req.io.emit("markGuestTaskOTW", markedGuestReq);

    await sendNotification(
      req,
      "Staff Member On The Way!",
      "A staff member is on their way to address your request. Thank you for your patience!",
      " ",
      "member",
      markedGuestReq.guestId
    );
    return res.status(200).json({ success: true, markedGuestReq });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error", err });
  }
};
const markAsCompleted = async (req, res) => {
  try {
    const { taskId, staffId } = req.params;

    const markedGuestReq = await GuestReq.findById(taskId);

    const staff = await Staff.findById(staffId);

    if (markedGuestReq.completed) {
      const completedByStaff = (
        await Staff.findById(markedGuestReq.completedBy)
      ).username;
      return res.status(409).json({
        success: false,
        message: `Task already completed by ${completedByStaff}`,
      });
    }

    (markedGuestReq.completed = true),
      (markedGuestReq.completedBy = staffId),
      await markedGuestReq.save();

    req.io.emit("markGuestTaskCompleted", markedGuestReq);
    await sendNotification(
      req,
      "Your request is complete!!",
      `This message is to confirm that your recent request for ${markedGuestReq.serviceType} has been completed by our staff.`,
      " ",
      "member",
      markedGuestReq.guestId
    );
    return res.status(200).json({ success: true, markedGuestReq });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error", err });
  }
};

module.exports = {
  createGuestReq,
  getGuestRequests,
  getRequestsOfGuests,
  handleOnTheWay,
  markAsCompleted,
};
