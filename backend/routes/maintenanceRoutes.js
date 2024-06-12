const express = require("express");
const {
  createIssue,
  getAllIssues,
  getIssueById,
  updateIssue,
  deleteIssue,
} = require("../controllers/maintenanceController");
const router = express.Router();

router.post("/:staffId", createIssue);
router.get("/", getAllIssues);
router.get("/:id", getIssueById);
router.put("/:id", updateIssue);
router.delete("/:id", deleteIssue);

module.exports = router;
