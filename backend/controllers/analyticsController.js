const Booking = require("../models/bookingModel");
const ServiceOrders = require("../models/serviceOrderModel");

const calculateTotalBookingRevenue = async (req, res) => {
  try {
    const bookings = await Booking.find();
    let totalBookingRevenue = 0;

    bookings.forEach((booking) => {
      totalBookingRevenue += booking.bookingCost;
    });

    res.status(200).json({ success: true, totalBookingRevenue });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Internal server error", error });
  }
};

const calculateTotalServiceRevenue = async (req, res) => {
  try {
    const serviceOrders = await ServiceOrders.find();
    let totalServiceRevenue = 0;

    serviceOrders.forEach((serviceOrder) => {
      totalServiceRevenue += serviceOrder.cost;
    });

    res.status(200).json({ success: true, totalServiceRevenue });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Internal server error", error });
  }
};

const calculateTotalRevenue = async (req, res) => {
  try {
    const bookings = await Booking.find();
    const serviceOrders = await ServiceOrders.find();
    let totalRevenue = 0;

    bookings.forEach((booking) => {
      totalRevenue += booking.totalCost;
    });

    serviceOrders.forEach((serviceOrder) => {
      totalRevenue += serviceOrder.cost;
    });

    res.status(200).json({ success: true, totalRevenue });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Internal server error", error });
  }
};

module.exports = {
  calculateTotalBookingRevenue,
  calculateTotalServiceRevenue,
  calculateTotalRevenue,
};
