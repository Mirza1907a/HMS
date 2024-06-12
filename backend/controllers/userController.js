const User = require("../models/userModel");
require("dotenv").config();
const bcrypt = require('bcryptjs')

const jwt = require("jsonwebtoken");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "15d" });
};

const getMembers = async (req, res) => {
  const members = await User.find({ role: "member" }).sort({ createdAt: -1 });

  if (members.length === 0) {
    return res
      .status(404)
      .json({ success: false, message: "No member found!" });
  }

  res.status(200).json({ success: true, members });
};
const getUsers = async (req, res) => {
  const user = await User.find({}).sort({ createdAt: -1 });

  res.status(201).json(user);
};
//login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);

    const token = createToken(User._id);

    res.status(200).json({
      _id: user._id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      fullName: user.fullName,
      role: user.role,
      token,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const signupUser = async (req, res) => {
  const { first_name, last_name, email, password, phoneNumber } = req.body;

  try {
    const user = await User.signup(
      first_name,
      last_name,
      email,
      phoneNumber,
      password
    );

    const token = createToken(user._id);

    res.status(200).json({ first_name, last_name, email, phoneNumber, token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const updateUserDetails = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const { userId } = req.params;

    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (password) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      user.password = hashedPassword;
    }

    user.first_name = firstName || user.first_name;
    user.last_name = lastName || user.last_name;
    user.email = email || user.email;

    await user.save();

    res.status(200).json({
      message: "User details updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
const updatePassword = async (req, res) => {
  const { password, newPassword } = req.body;
  const { userId } = req.params;
  try {
    const user = await User.updatePassword(password, newPassword, userId);

    return res
      .status(200)
      .json({ success: true, message: "Password updated!" });
  } catch (err) {
    console.log(err)
    return res.status(500).json({ success: false, message: err });
  }
};
module.exports = {
  loginUser,
  updateUserDetails,
  updatePassword,
  signupUser,
  getUsers,
  getMembers,
};
