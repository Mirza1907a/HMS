const MaintenanceIssue = require("../models/maintenanceModel");
const {
  sendNotificationToAdmins,
  sendNotification,
} = require("./notificationController");
const Staff = require("../models/staffModel");

// Create a new maintenance issue
const createIssue = async (req, res) => {
  try {
    const { maintenance, issue, roomNumber, priority } = req.body;
    const { staffId } = req.params;

    const staff = await Staff.findById(staffId);

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "No staff found with the id provided!",
      });
    }

    const newIssue = new MaintenanceIssue({
      roomNumber: roomNumber,
      category: maintenance,
      issue: issue,
      priority: priority,
      reportedBy: staffId,
    });

    const savedIssue = await newIssue.save();

    const updatedIssue = await MaintenanceIssue.findById(
      savedIssue._id
    ).populate("reportedBy");

    const notificationTitle = `New Maintenance Issue Reported ${
      roomNumber ? `In Room Number ${roomNumber}` : ""
    } `;
    const notificationDescription = `A new issue has been reported by Staff '${staff.username}'. \n\nCategory: ${maintenance}\nDescription: ${issue}`;

    await sendNotificationToAdmins(
      req,
      notificationTitle,
      notificationDescription,
      `/admin/issues/${newIssue._id}`
    );

    Object.values(req.userSockets).forEach((socketId) => {
      req.io.to(socketId).emit("newIssue", updatedIssue);
    });

    res.status(201).json(savedIssue);
  } catch (error) {
    res.status(500).json({ message: "Error creating issue", error });
  }
};

const getAllIssues = async (req, res) => {
  try {
    const issues = await MaintenanceIssue.find().populate(
      "reportedBy",
      "username"
    );
    res.status(200).json(issues);
  } catch (error) {
    res.status(500).json({ message: "Error fetching issues", error });
  }
};

const getIssueById = async (req, res) => {
  try {
    const issue = await MaintenanceIssue.findById(req.params.id).populate(
      "reportedBy",
      "name email"
    );
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }
    res.status(200).json(issue);
  } catch (error) {
    res.status(500).json({ message: "Error fetching issue", error });
  }
};

const updateIssue = async (req, res) => {
  try {
    const { status } = req.body;

    const updatedIssue = await MaintenanceIssue.findByIdAndUpdate(
      req.params.id,
      { status, status },
      { new: true }
    );

    if (!updatedIssue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    await sendNotification(
      req,
      `Your Maintenance Report Has Been Resolved!`,
      `Your reported issue for ${updatedIssue.category} has been resolved.`,
      "",
      "staff",
      updatedIssue.reportedBy
    );

    res.status(200).json(updatedIssue);
  } catch (error) {
    res.status(500).json({ message: "Error updating issue", error });
  }
};

const deleteIssue = async (req, res) => {
  try {
    const deletedIssue = await MaintenanceIssue.findByIdAndDelete(
      req.params.id
    );
    if (!deletedIssue) {
      return res.status(404).json({ message: "Issue not found" });
    }
    res.status(200).json({ message: "Issue deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting issue", error });
  }
};

module.exports = {
  deleteIssue,
  updateIssue,
  createIssue,
  getAllIssues,
  getIssueById,
};
