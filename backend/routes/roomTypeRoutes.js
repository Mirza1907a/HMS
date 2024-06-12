const { createRoomType,getRoomTypes, deleteRoomType } = require('../controllers/roomTypeController');
const express = require('express');


const router = express.Router();

router.get("/",getRoomTypes)
router.post("/insert",createRoomType);
router.delete("/delete/:id",deleteRoomType)

module.exports = router;