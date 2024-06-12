const Service = require("../models/serviceModel");
const ServiceOrder = require("../models/serviceOrderModel");
const Booking = require("../models/bookingModel");
const User = require("../models/userModel");
const {
  sendNotification,
  sendNotificationToAdmins,
  sendNotificationAllStaff,
} = require("./notificationController");

const OrderService = async (req, res) => {
  try {
    const { serviceIds, quantities } = req.body;
    const { bookingId, userId } = req.params;

    const booking = await Booking.findById(bookingId);
    const user = await User.findById(userId);

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    let totalServiceCost = 0;
    const serviceOrders = [];
    let serviceOrder;

    for (let i = 0; i < serviceIds.length; i++) {
      const service = await Service.findById(serviceIds[i]);
      if (!service) {
        return res.status(404).json({
          success: false,
          message: `Service with ID ${serviceIds[i]} not found`,
        });
      }

      const quantity = quantities[serviceIds[i]] || 1;
      const cost = service.price * quantity;
      totalServiceCost += cost;

      serviceOrder = new ServiceOrder({
        user: userId,
        description: `${user.first_name} ${user.last_name} ordered ${quantity} ${service.name}`,
        booking: bookingId,
        service: serviceIds[i],
        quantity,
        cost,
      });

      await serviceOrder.save();

      const populatedServices = await serviceOrder.populate("user");

      Object.values(req.userSockets).forEach((socketId) => {
        req.io.to(socketId).emit("newTransaction", populatedServices);
      });

      serviceOrders.push(serviceOrder._id);
    }

    booking.serviceOrders.push(...serviceOrders);
    booking.serviceCost += totalServiceCost;
    booking.totalCost += totalServiceCost;

    const UpdatedBooking = await booking.save();
    const guestIdString = userId.toString();
    const socketId = req.guestSockets[guestIdString];
    if (socketId) {
      req.io.to(socketId).emit("newTransaction", UpdatedBooking);
      req.io.to(socketId).emit("updateBookingService", booking);
    } else {
      console.log(`Socket ID not found for guest with ID: ${userId}`);
    }
    await sendNotification(
      req,
      "Your Service Order Has Been Successfully Placed",
      `Dear ${user.first_name} ${user.last_name},\n\nYour service order has been successfully placed. Our staff will take care of everything. Thank you for choosing our services!`,
      "",
      "member",
      userId
    );

    const serviceMessage =
      serviceIds.length > 1 ? "multiple services" : "a service";
    await sendNotificationToAdmins(
      req,
      "Transaction Alert!",
      `${user.first_name} ${
        user.last_name
      } has booked ${serviceMessage} with a total cost of Rs.${totalServiceCost.toFixed(
        2
      )}. Please review the order details and ensure everything is prepared for the guest's satisfaction.`,
      `/transactions/${serviceOrder._id}`,
      "member",
      userId
    );
    await sendNotificationAllStaff(
      req,
      "Transaction Alert!",
      `${user.first_name} ${user.last_name} has booked ${serviceMessage}. Please review the order details and ensure everything is prepared for the guest's satisfaction.`,
      `/transactions/${serviceOrder._id}`
    );

    return res.status(200).json({
      success: true,
      message: "Services ordered successfully",
      booking,
      serviceOrders,
    });
  } catch (error) {
    console.error("Error ordering services:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error", error });
  }
};

const GetOrderServices = async (req, res) => {
  try {
    const ServiceOrders = await ServiceOrder.find()
      .sort({ orderDate: -1 })
      .populate("user")
      .populate("service");

    return res.status(200).json({ success: true, ServiceOrders });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: `Internal server error: ${err}` });
  }
};

const getGuestOrderedServices = async (req, res) => {
  try {
    const { userId } = req.params;

    const ServiceOrders = await ServiceOrder.find({ user: userId }).populate(
      "service"
    );

    return res.status(200).json({ success: true, ServiceOrders });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: `Internal server error ${err}` });
  }
};

module.exports = { OrderService, GetOrderServices, getGuestOrderedServices };
