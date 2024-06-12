const User = require("../models/userModel");
const Notification = require("../models/notificationModel");
const Staff = require("../models/staffModel");
const Task = require("../models/taskModel");

const sendNotificationFromAdmin = async (req, res) => {
  try {
    const { title, description, sendTo, sendAll, reciever } = req.body;
    const { adminId } = req.params;

    const message = description;
    if (!adminId) {
      return res
        .status(400)
        .json({ success: false, message: "No adminId found!" });
    }
    const link = "";

    if (reciever === "guest") {
      if (sendAll) {
        await sendNotificationToAllGuests(req, title, message, link);
      }
      if (sendTo && sendTo.length > 0) {
        for (const guest of sendTo) {
          await sendNotification(req, title, message, link, "member", guest);
        }
      }
    } else if (reciever === "staff") {
      if (sendAll) {
        await sendNotificationAllStaff(req, title, message, link);
      }
      for (const staff of sendTo) {
        await sendNotification(req, title, message, link, "staff", staff);
      }
    }

    return res
      .status(200)
      .json({ success: true, message: "Notifications sent successfully" });
  } catch (error) {
    console.error("Error sending notification:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
};

const getNotis = async (req, res) => {
  try {
    const { user, userId } = req.params;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let notifications = null;

    if (user === "staff") {
      notifications = await Notification.find({
        staff: userId,
        createdAt: { $gte: yesterday, $lt: new Date() },
      }).sort({ createdAt: -1 });
    } else if (user === "user") {
      notifications = await Notification.find({
        user: userId,
        createdAt: { $gte: yesterday, $lt: new Date() },
      }).sort({ createdAt: -1 });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Invalid user type" });
    }

    return res.status(200).json({ success: true, notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const sendNotificationAllStaff = async (req, title, message, link) => {
  try {
    const staffs = await Staff.find();

    for (const staff of staffs) {
      await sendNotification(req, title, message, link, "staff", staff._id);
    }

    return { success: true, message: "Notifications sent successfully" };
  } catch (error) {
    console.log("Error sending notification:", error);
    return { success: false, error: "Internal server error" };
  }
};

const sendNotification = async (req, title, message, link, recipient, id) => {
  try {
    if (recipient === "staff") {
      const notification = new Notification({
        staff: id,
        title,
        message,
        link,
      });
      await notification.save();

      const staffIdString = id.toString();
      const socketId = req.staffSockets[staffIdString];
      if (socketId) {
        req.io.to(socketId).emit("notiCreated", notification);
      } else {
        console.log(`Socket ID not found for staff member with ID: ${id}`);
      }
    } else if (recipient === "admin") {
      const notification = new Notification({
        user: id,
        title,
        message,
      });
      await notification.save();

      const adminIdString = id.toString(); // Convert staff._id to string
      const socketId = req.userSockets[adminIdString]; // Use the converted string
      if (socketId) {
        req.io.to(socketId).emit("notiCreated", notification);
      } else {
        console.log(`Socket ID not found for admin with ID: ${id}`);
      }

      console.log(`Notification sent to admin`);
    } else if (recipient === "member") {
      const notification = new Notification({
        user: id,
        title,
        message,
        link,
      });
      await notification.save();

      const guestIdString = id.toString(); // Convert staff._id to string
      const socketId = req.guestSockets[guestIdString]; // Use the converted string
      if (socketId) {
        req.io.to(socketId).emit("notiCreated", notification);
      } else {
        console.log(`Socket ID not found for guest with ID: ${id}`);
      }

      console.log(`Notification sent to Guests`);
    }

    console.log(`Notification sent to ${recipient}`);
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};
const sendNotificationToHousekeepers = async (req, title, message, link) => {
  try {
    const staffMembers = await Staff.find({ role: "Housekeeper" });

    for (const staffMember of staffMembers) {
      await sendNotification(
        req,
        title,
        message,
        link,
        "staff",
        staffMember._id
      );
    }

    console.log("Notifications sent to staff members");
  } catch (error) {
    console.error("Error sending notifications:", error);
  }
};
const sendNotificationToReceptionists = async (req, title, message, link) => {
  try {
    const staffMembers = await Staff.find({ role: "Receptionist" });

    for (const staffMember of staffMembers) {
      await sendNotification(
        req,
        title,
        message,
        link,
        "staff",
        staffMember._id
      );
    }

    console.log("Notifications sent to staff members");
  } catch (error) {
    console.error("Error sending notifications:", error);
  }
};
const sendNotificationToStaff = async (req, title, message, link, sentB) => {
  try {
    const staffMembers = await Staff.find();

    for (const staffMember of staffMembers) {
      await sendNotification(
        req,
        title,
        message,
        link,
        "staff",
        staffMember._id
      );
    }

    console.log("Notifications sent to staff members");
  } catch (error) {
    console.error("Error sending notifications:", error);
  }
};

const sendNotificationToAdmins = async (req, title, message, link) => {
  try {
    const adminUsers = await User.find({ role: "admin" });

    for (const adminUser of adminUsers) {
      await sendNotification(req, title, message, link, "admin", adminUser._id);
    }
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};

const sendNotificationToAllGuests = async (req, title, message, link) => {
  try {
    const Guests = await User.find({ role: "member" }).sort({ createdAt: -1 });

    for (const guest of Guests) {
      await sendNotification(req, title, message, link, "member", guest._id);
    }
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};

const markSeen = async (req, res) => {
  try {
    const { id } = req.params;

    const noti = await Notification.findById(id);

    if (!noti) {
      return res.status(404).json({
        success: false,
        message: "No such notification with the id provided",
      });
    }

    if (!id) {
      return res
        .status(404)
        .json({ success: false, message: "No such user with the id" });
    }

    const updatedNoti = await Notification.findOneAndUpdate(
      { _id: id },
      { $set: { seen: true } },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "notification marked as seen!",
      _id: updatedNoti._id,
      seen: updatedNoti.seen,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" + err });
  }
};

const markAllNotificationsAsSeen = async (req, res) => {
  try {
    const { userType, userId } = req.params;

    let query = {};
    if (userType === "user") {
      query = { user: userId, seen: false };
    } else if (userType === "staff") {
      query = { staff: userId, seen: false };
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Invalid user type provided" });
    }

    const unseenNotifications = await Notification.find(query);

    if (unseenNotifications.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No unseen notifications found" });
    }

    await Notification.updateMany(query, { $set: { seen: true } });

    let updatedNotifications = [];
    if (userType === "user") {
      updatedNotifications = await Notification.find({ user: userId });
    } else if (userType === "staff") {
      updatedNotifications = await Notification.find({ staff: userId });
    }

    res.status(200).json({
      success: true,
      message: "All notifications marked as seen",
      notifications: updatedNotifications,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getNotis,
  sendNotificationToAdmins,
  sendNotification,
  markSeen,
  sendNotificationAllStaff,
  sendNotificationToStaff,
  markAllNotificationsAsSeen,
  sendNotificationToAllGuests,
  sendNotificationToHousekeepers,
  sendNotificationFromAdmin,
  sendNotificationToReceptionists,
};
