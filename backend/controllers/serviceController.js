const Service = require("../models/serviceModel");
const ServiceCategory = require("../models/serviceCategoryModel");
const {
  sendNotificationToAllGuests,
  sendNotificationToAdmins,
} = require("./notificationController");
const User = require("../models/userModel");

// Create a new service
const createService = async (req, res) => {
  const { name, description, category, price, notify } = req.body;

  const image = req.file ? req.file.filename : null;

  if (!name || !category || !price) {
    return res
      .status(400)
      .json({ message: "Name, category, and price are required." });
  }

  const service = new Service({
    name,
    description,
    category,
    price,
    image: image,
  });

  try {
    const newService = (await service.save()).populate("category");

    if (notify) {
      const S_Category = await ServiceCategory.findById(category);

      await sendNotificationToAllGuests(
        req,
        `New Service Alert: ${newService.name} Now Available!`,
        `Discover our newest addition in the ${S_Category.name} category! From delectable dining to luxurious amenities, ${newService.name} promises to elevate your stay. Book now and experience the extraordinary!`,
        `/services/${newService.name}`
      );
    }

    Object.values(req.guestSockets).forEach((socketId) => {
      req.io.to(socketId).emit("newService", newService);
    });
    Object.values(req.userSockets).forEach((socketId) => {
      req.io.to(socketId).emit("newService", newService);
    });
    res.status(201).json(newService);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getServices = async (req, res) => {
  try {
    const services = await Service.find()
      .populate("category")
      .sort({ createdAt: -1 });
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteService = async (req, res) => {
  try {
    const { userId } = req.params;
    const { serviceIds } = req.body;

    const user = (await User.findById(userId)).first_name;

    const result = await Service.deleteMany({ _id: { $in: serviceIds } });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "No service found with the id provided!",
      });
    }

    if (result.deletedCount === 1) {
      await sendNotificationToAdmins(
        req,
        "Service deleted!",
        `${user} deleted a service!`
      );
    } else if (result.deletedCount > 1) {
      await sendNotificationToAdmins(
        req,
        "Multiple Services deleted!",
        `${user} deleted multiple bookings!`
      );
    }

    req.io.emit("serviceDelete", serviceIds);

    return res.status(200).json({
      success: true,
      message: `Selected service(s) deleted: ${result.deletedCount}.`,
      description: "Admins Notified!",
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error", error: err });
  }
};

module.exports = { createService, getServices, deleteService };
