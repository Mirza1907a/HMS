const Feedback = require("../models/feedbackModel");
const Booking = require("../models/bookingModel");
const User = require("../models/userModel");
const Room = require("../models/roomModel");
const {
  sendNotificationToAdmins,
  sendNotificationToReceptionists,
  sendNotification,
} = require("./notificationController");

const getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({})
      .populate("guestId")
      .sort({ createdAt: -1 });

    if (feedbacks.length === 0) {
      return null;
    }

    res.status(200).json({ success: true, feedbacks });
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    res.status(500).json({ error: "Failed to fetch feedbacks" });
  }
};

const getGlobalFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ show: true })
      .populate("guestId")
      .sort({ createdAt: -1 });

    if (feedbacks.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No global feedback found" });
    }

    res.status(200).json({ success: true, feedbacks });
  } catch (error) {
    console.error("Error fetching global feedbacks:", error);
    res.status(500).json({ error: "Failed to fetch global feedbacks" });
  }
};

const getGuestsFeedback = async (req, res) => {
  const { guestId } = req.params;

  try {
    const feedbacks = await Feedback.find({ guestId })
      .populate("guestId")
      .sort({ createdAt: -1 });

    if (feedbacks.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No feedback found for the provided guest ID",
      });
    }

    res.status(200).json({ success: true, feedbacks });
  } catch (error) {
    console.error("Error fetching feedback by guest ID:", error);
    res.status(500).json({ error: "Failed to fetch feedback by guest ID" });
  }
};

const createFeedback = async (req, res) => {
  try {
    const { rating, body, tags, guestId, roomId, bookingId } = req.body;

    if (!guestId || !roomId || !bookingId || !rating || !body) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const guest = await User.findById(guestId);
    const roomType = await Room.findById(roomId);

    const feedback = await Feedback.create({
      guestId,
      room: roomType._id,
      bookingId,
      rating,
      body,
      tags,
    });

    const booking = await Booking.findById(bookingId);

    booking.feedback = true;

    await booking.save();

    const populatedFeedback = await Feedback.findById(feedback._id).populate(
      "guestId"
    );

    await sendNotificationToAdmins(
      req,
      `New Feedback from ${guest.fullName}`,
      `${guest.fullName} rated their stay ${rating} stars and left the following feedback: "${body}"`
    );
    await sendNotificationToReceptionists(
      req,
      `New Feedback from ${guest.fullName}`,
      `${guest.fullName} rated their stay ${rating} stars and left the following feedback: "${body}"`
    );

    res.status(201).json({ success: true, populatedFeedback, booking });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to create feedback", message: err });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { show } = req.body;

    if (typeof show !== "boolean") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid 'show' value" });
    }

    const feedback = await Feedback.findByIdAndUpdate(
      id,
      { show: show },
      { new: true }
    );

    if (!feedback) {
      return res
        .status(404)
        .json({ success: false, message: "Feedback not found" });
    }

    req.io.emit("feedbackStatus", feedback);
    return res
      .status(200)
      .json({ success: true, message: "Status updated", feedback });
  } catch (error) {
    console.error("Error updating status:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const voteFeedback = async (req, res) => {
  const { feedbackId, guestId, voteType } = req.body;

  try {
    let update;

    const feedback = await Feedback.findById(feedbackId);

    const hasUpvoted = feedback.upvotedBy.includes(guestId);
    const hasDownvoted = feedback.downvotedBy.includes(guestId);

    if (voteType === "upvote") {
      if (hasDownvoted) {
        update = {
          $inc: { upvotes: 1, downvotes: -1 },
          $addToSet: { upvotedBy: guestId },
          $pull: { downvotedBy: guestId },
        };
      } else if (hasUpvoted) {
        update = {
          $inc: { upvotes: -1 },
          $pull: { upvotedBy: guestId },
        };
      } else {
        update = {
          $inc: { upvotes: 1 },
          $addToSet: { upvotedBy: guestId },
        };
        await sendNotification(
          req,
          "Your feedback got a new upvote!",
          "Someone upvoted your feedback!",
          " ",
          "member",
          feedback.guestId
        );
      }
    } else if (voteType === "downvote") {
      if (hasUpvoted) {
        update = {
          $inc: { upvotes: -1, downvotes: 1 },
          $addToSet: { downvotedBy: guestId },
          $pull: { upvotedBy: guestId },
        };
      } else if (hasDownvoted) {
        update = {
          $inc: { downvotes: -1 },
          $pull: { downvotedBy: guestId },
        };
      } else {
        update = {
          $inc: { downvotes: 1 },
          $addToSet: { downvotedBy: guestId },
        };
        await sendNotification(
          req,
          "Your feedback got a new downvote!",
          "Someone downvoted your feedback!",
          " ",
          "member",
          feedback.guestId
        );
      }
    } else {
      return res.status(400).json({ error: "Invalid vote type" });
    }

    // Update the review
    const updatedFeedback = await Feedback.findByIdAndUpdate(
      feedbackId,
      update,
      {
        new: true,
      }
    );
    req.io.emit("voteFeedback", updatedFeedback);
    res.status(200).json(updatedFeedback);
  } catch (error) {
    console.error("Error voting on feedback:", error);
    res.status(500).json({ error: "Failed to vote on feedback" });
  }
};

module.exports = {
  getAllFeedback,
  createFeedback,
  getGuestsFeedback,
  getGlobalFeedbacks,
  updateStatus,
  voteFeedback,
};
