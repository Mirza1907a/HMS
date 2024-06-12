const express = require("express");

const {
  loginStaff,
  signupStaff,
  getStaff,
  updateStaffStatus,
  updateStaffRole,
  deleteStaff,
  updateStaffDetails,
} = require("../controllers/staffController");
const multer = require('multer')
const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../public/StaffPfps/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });
router.post("/signup", upload.single("image"), signupStaff);

router.get("/", getStaff);

//Login
router.post("/login", loginStaff);

//Signup

//update role

router.patch("/update_role/:id", updateStaffRole);

router.patch("/update_status/:id", updateStaffStatus);
router.patch("/update_details/:id", updateStaffDetails);
router.delete("/delete/:id", deleteStaff);

module.exports = router;
