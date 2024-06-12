const {
  createTask,
  getTask,
  getAllTask,
  deleteTask,
  viewBy,
  markAsCompleted,
} = require("../controllers/taskController");
const checkAdmin = require("../middlewares/checkAdmin");
const express = require("express");

const router = express.Router();

router.post("/create", createTask);
router.get("/get_staff_tasks/:id", getTask);
router.get("/get_admin_tasks/:adminId", getAllTask);
router.post("/:taskId/seenBy/:staffId", viewBy);
router.patch("/:taskId/mark_as_completed/:staffId", markAsCompleted);

router.post("/delete", deleteTask);

module.exports = router;
