const express = require("express");
const router = express.Router();
const {
  createService,
  getServices,
  deleteService,
} = require("../controllers/serviceController");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../public/ServiceImages/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/", upload.single("image"), createService);

router.get("/", getServices);
router.post("/delete/:userId", deleteService);

module.exports = router;
