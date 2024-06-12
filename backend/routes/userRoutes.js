const express = require("express");

const {
  loginUser,
  signupUser,
  getUsers,
  updateUserDetails,
  getMembers,
  updatePassword,
} = require("../controllers/userController");

const router = express.Router();

router.get("/", getUsers);

router.get("/members", getMembers);

//Login
router.post("/login", loginUser);

//Signup
router.post("/signup", signupUser);
router.patch("/updateUserDetails/:userId", updateUserDetails);
router.patch("/updatePassword/:userId", updatePassword);

module.exports = router;
