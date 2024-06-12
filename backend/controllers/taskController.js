const Task = require("../models/taskModel");
const User = require("../models/userModel");
const Staff = require("../models/staffModel");
const {
  sendNotificationToAdmins,
  sendNotificationAllStaff,
  sendNotificationToStaff,
  sendNotification,
} = require("./notificationController");
const generateTaskId = require("../utils/generateTaskId");

const createTask = async (req, res) => {
  try {
    const { createdBy } = req.body;

    const task = await Task.create({
      ...req.body,
      taskId: await generateTaskId(),
    });
    await task.populate("assignedTo", "username");

    const createdByUser = await User.findById(createdBy).select(
      "first_name last_name"
    );
    task.createdBy = createdByUser;

    if (task.assignedAll) {
      await sendNotificationAllStaff(
        req,
        "A new task has been assigned to you.",
        task.description,
        `/staff/tasks/${task._id}`
      );

      await sendNotificationToAdmins(
        req,
        "A Task has been assigned to All the staff",
        task.description
      );
      req.io.emit("createTask", task);
    }

    if (task.assignedTo && task.assignedTo.length > 0) {
      const assignedToUsernames = task.assignedTo
        .map((staff) => staff.username)
        .join(", ");

      for (const staff of task.assignedTo) {
        const StaffIdString = staff._id.toString();
        const socketId = req.staffSockets[StaffIdString];
        if (socketId) {
          req.io.to(socketId).emit("createTask", task);
        }
      }

      for (const adminId in req.userSockets) {
        const AdminIdString = adminId.toString();
        const adminSocketId = req.userSockets[AdminIdString];
        req.io.to(adminSocketId).emit("createTask", task);
      }

      await sendNotificationToAdmins(
        req,
        `A Task has been assigned to ${assignedToUsernames}`,
        task.description
      );

      for (const staff of task.assignedTo) {
        await sendNotificationToStaff(
          req,
          `A Task has been assigned to you from ${createdByUser.first_name}`,
          task.description,
          staff._id
        );
      }
    }

    return res
      .status(201)
      .json({ success: true, message: "Task created!", task });
  } catch (err) {
    console.error("Error creating task:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const getAllTask = async (req, res) => {
  try {
    const { adminId } = req.params;

    const admin = await User.findById(adminId);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "No user found with the id provided!",
      });
    }

    if (admin.role !== "admin") {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized access" });
    }

    const tasks = await Task.find()
      .sort({ createdAt: -1 })
      .populate([
        { path: "createdBy", select: ["first_name", "last_name"] },
        { path: "seenBy", select: "username" },
        { path: "completedBy", select: "username" },
        {
          path: "assignedTo",
          selected: "username",
        },
      ]);

    return res.status(200).json({
      success: true,
      message: "Tasks fetched successfully!",
      tasks,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const getTask = async (req, res) => {
  try {
    const { id } = req.params;

    const tasks = await Task.find({
      $or: [{ assignedTo: id }, { assignedAll: true }],
    }).populate([
      { path: "createdBy", select: ["first_name", "last_name"] },
      { path: "seenBy", select: "username" },
      { path: "completedBy", select: "username" },
    ]);

    if (tasks.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No tasks found for the staff" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Tasks fetched successfully!", tasks });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const viewBy = async (req, res) => {
  try {
    const { staffId, taskId } = req.params;
    const task = await Task.findOne({ _id: taskId });

    if (!task.seenBy.includes(staffId)) {
      task.seenBy.push(staffId);

      await task.save();

      const seenByStaffIds = task.seenBy;
      const seenByStaff = await Staff.find({ _id: { $in: seenByStaffIds } });

      const seenBy = task.seenBy.map((id) => {
        const staff = seenByStaff.find((staff) => staff._id.equals(id));
        return { _id: id, username: staff ? staff.username : "" };
      });

      console.log(seenBy);
      req.io.emit("taskMarkedAsSeen", {
        taskId,
        staffId,
        seenBy: seenBy,
      });

      return res.status(200).json({ success: true, task });
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

const markAsCompleted = async (req, res) => {
  try {
    const { taskId, staffId } = req.params;

    const task = await Task.findById(taskId);

    const staff = await Staff.findById(staffId);

    if (!staff) {
      return res
        .status(404)
        .json({ success: false, message: "Staff not found" });
    }

    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    if (task.status === "Completed") {
      return res
        .status(400)
        .json({ success: false, message: "Task is already completed" });
    }

    const updatedTask = await Task.findOneAndUpdate(
      { _id: taskId },
      { $set: { status: "Completed", completedBy: staffId } },
      { new: true }
    ).populate("completedBy", "username");

    req.io.emit("taskCompleted", {
      status: updatedTask.status,
      completedBy: updatedTask.completedBy,
      taskId,
      staffId,
    });

    await sendNotificationToAdmins(
      req,
      `${updatedTask.title} completed by ${updatedTask.completedBy.username}`,
      `Task completed by ${updatedTask.completedBy.username}`
    );
    return res.status(200).json({
      success: true,
      message: "Task marked as completed",
      task: updatedTask,
    });
  } catch (err) {
    console.error("Error marking task as completed:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { taskIds } = req.body;

    if (!Array.isArray(taskIds) || taskIds.length === 0) {
      return res.status(400).json({ error: "No task IDs provided." });
    }

    const deletedTasks = [];

    for (const id of taskIds) {
      const task = await Task.findByIdAndDelete({ _id: id });

      if (!task) {
        continue;
      }

      deletedTasks.push(task);

      if (task.assignedTo && task.assignedTo.length > 0) {
        for (const staff of task.assignedTo) {
          await sendNotification(
            req,
            `Task Deleted!`,
            `'${task.title}' you were assigned to is now deleted!`,
            " ",
            "staff",
            staff
          );
        }
        req.io.emit("deleteTask", task);
      } else if (task.assignedAll) {
        req.io.emit("deleteTask", task);
        await sendNotificationToStaff(
          req,
          `Task Deleted!`,
          `'${task.title}' you were assigned to is now deleted!`
        );
      }
    }

    return res.status(200).json({ deletedTasks });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ error: "An error occurred while deleting tasks." });
  }
};

module.exports = {
  createTask,
  getTask,
  getAllTask,
  deleteTask,
  viewBy,
  markAsCompleted,
};
