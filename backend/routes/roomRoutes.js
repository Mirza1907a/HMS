const {
  createRoom,
  getRooms,
  checkRoomNumber,
  updateStatus,
  deleteRoom,
} = require("../controllers/roomController");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const express = require("express");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const destinationPath = path.join(__dirname, "../../public/RoomImages/");
    cb(null, destinationPath);
  },
  filename: function (req, file, cb) {
    const uniqueFileName = `${uuidv4()}-${Date.now()}.jpg`;
    cb(null, uniqueFileName);
  },
});

const upload = multer({
  storage: storage,
  onError: function (err, next) {
    console.error("Multer error:", err);
    next(err);
  },
});

router.get("/", getRooms);

router.post("/add", upload.array("images"), createRoom);

router.post("/check_room_number", checkRoomNumber);
router.patch("/:staffId/update_status/:id", updateStatus);
router.post("/deleteRoom/:userId",deleteRoom)
module.exports = router;
