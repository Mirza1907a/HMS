const RoomType = require("../models/roomTypeModel");
const Room = require("../models/roomModel");

const createRoomType = async (req, res) => {
  try {
    const existingRoomType = await RoomType.findOne(req.body);
    if (existingRoomType) {
      return res.status(409).json({ error: "Room type already exists!" });
    }

    const newRoomType = await RoomType.create(req.body);

    return res
      .status(201)
      .json({ message: "Room type created", roomType: newRoomType });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getRoomTypes = async (req, res) => {
  try {
    const roomTypes = await RoomType.find().sort({ createdAt: -1 });

    if (!roomTypes || roomTypes.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No Room Type Found" });
    }
    return res.status(200).json(roomTypes);
  } catch (err) {
    console.error("Error fetching room types:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const deleteRoomType = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(404)
        .json({ message: "No such room type with that id" });
    }
    const deletedRoom = await RoomType.findOneAndDelete({ _id: id });

    if (!deletedRoom) {
      return res.status(404).json({ message: "Room type not found." });
    }

    await Room.deleteMany({ type: id });

    return res.status(200).json({
      message: "Room type and associated rooms deleted successfully.",
      deletedRoom,
    });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

module.exports = { createRoomType, getRoomTypes, deleteRoomType };
