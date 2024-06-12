const Room = require("../models/roomModel");
const Staff = require("../models/staffModel");
const RoomType = require("../models/roomTypeModel");
const User = require("../models/userModel");
const { sendNotificationToAdmins } = require("./notificationController");
const { createBlogUtil } = require("./blogController");

const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find().sort({ createdAt: -1 }).populate("type");

    if (!rooms) {
      return res.status(404).json({ message: "No Rooms available" });
    }

    return res.status(200).json(rooms);
  } catch (err) {
    return res.status(500).json({ messsage: err });
  }
};
const createRoom = async (req, res) => {
  try {
    const {
      type,
      roomNumber,
      multipleRooms,
      blog,
      blogTitle,
      blogDescription,
      blogAuthor,
      notifyGuests,
    } = req.body;
    const images = req.files.map((file) => ({
      filepath: file.filename,
    }));

    const typeOfRoom = await RoomType.findById(type);

    if (!typeOfRoom) {
      return res
        .status(404)
        .json({ success: false, message: "Room type not found!" });
    }

    const startRoomNumber = parseInt(roomNumber, 10);
    const roomsToCreate = multipleRooms ? parseInt(multipleRooms, 10) : 1;
    const endRoomNumber = startRoomNumber + roomsToCreate - 1;

    const existingRooms = await Room.find({
      roomNumber: { $gte: startRoomNumber, $lte: endRoomNumber },
    });

    if (existingRooms.length > 0) {
      const takenRoomNumbers = existingRooms.map((room) => room.roomNumber);
      return res.status(409).json({
        success: false,
        message: `Room numbers ${takenRoomNumbers.join(
          ", "
        )} are not available!`,
      });
    }

    let rooms = [];
    for (let i = 0; i < roomsToCreate; i++) {
      const currentRoomNumber = startRoomNumber + i;

      const room = await Room.create({
        ...req.body,
        roomNumber: currentRoomNumber,
        name: `${typeOfRoom.type} Room`,
        images: images,
      });
      rooms.push(room);
    }
    if (blog) {
      const blog = await createBlogUtil({
        req,
        
        title: blogTitle,
        image: "null",
        content: blogDescription,
        author: blogAuthor,
        roomId: typeOfRoom._id,
        notifyGuests: notifyGuests,
      });
      console.log("Blog created:", blog);
    }

    res.status(201).json({ message: "Room(s) created successfully" });
  } catch (err) {
    if (err.name === "ValidationError") {
      res.status(400).json({ error: "Validation error", message: err.message });
    } else {
      console.log(err);
      res
        .status(500)
        .json({ error: "Internal server error", message: err.message });
    }
  }
};

const checkRoomNumber = async (req, res) => {
  try {
    const { roomNumber } = req.body;

    console.log("Checking room number:", roomNumber);

    const avail = await Room.find({ roomNumber: roomNumber });

    console.log("Found rooms:", avail);

    if (avail.length === 0) {
      console.log("Room number available");
      return res
        .status(200)
        .json({ success: true, message: "Room number available" });
    }

    console.log("Room number not available");
    return res
      .status(409)
      .json({ success: false, message: "Room number not available" });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { id, staffId } = req.params;

    const room = await Room.findByIdAndUpdate(
      id,
      { status: req.body.status },
      { new: true }
    );

    if (!room) {
      return res
        .status(404)
        .json({ success: true, message: "No such room with the id provided" });
    }
    const staff = await Staff.findById(staffId);
    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "No such staff member with the id provided",
      });
    }

    req.io.emit("roomStatus", room);
    const staffUsername = staff.username;

    await sendNotificationToAdmins(
      req,
      "Room Status Update by Staff Member",
      `Staff member ${staffUsername} has updated the status of room ${room.roomNumber} to ${room.status}.`
    );

    res.status(200).json({
      message: "Room status updated successfully",
      _id: room._id,
      status: room.status,
      staffUsername: staffUsername,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err });
  }
};

const deleteRoom = async (req, res) => {
  try {
    const { userId } = req.params;

    const { roomIds } = req.body;

    const user = await User.findById(userId);

    if (user.role !== "admin") {
      console.log("Unauthorized!");
      return res.status(409).json({ success: false, message: "Unauthorized!" });
    }

    const result = await Room.deleteMany({ _id: { $in: roomIds } });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "No Rooms found with the id provided!",
      });
    }

    if (result.deletedCount === 1) {
      await sendNotificationToAdmins(
        req,
        "Room deleted!",
        `${user.fullName} deleted a service!`
      );
    } else if (result.deletedCount > 1) {
      await sendNotificationToAdmins(
        req,
        "Multiple Rooms deleted!",
        `${user.fullName} deleted multiple rooms!`
      );
    }

    req.io.emit("deleteRoom", roomIds);

    return res.status(200).json({
      success: true,
      message: `Selected room(s) deleted: ${result.deletedCount}.`,
      description: "Admins Notified!",
    });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: `Internal server error ${err}` });
  }
};

module.exports = {
  createRoom,
  deleteRoom,
  getRooms,
  checkRoomNumber,
  updateStatus,
};
