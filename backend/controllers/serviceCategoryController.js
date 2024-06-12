const ServiceCategory = require("../models/serviceCategoryModel");
const Service = require("../models/serviceModel");

const createServiceCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const existingServiceType = await ServiceCategory.findOne(req.body);
    if (existingServiceType) {
      return res
        .status(409)
        .json({ error: "Service category already exists!" });
    }

    const newServiceType = await ServiceCategory.create({ name: name });

    return res.status(201).json({
      message: "Service category created",
      ServiceCategory: newServiceType,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getServiceCategories = async (req, res) => {
  try {
    const ServiceTypes = await ServiceCategory.find().sort({ createdAt: -1 });

    if (!ServiceTypes || ServiceTypes.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No Service Type Found" });
    }
    return res.status(200).json({ category: ServiceTypes });
  } catch (err) {
    console.error("Error fetching Service categories:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const deleteServiceCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(404)
        .json({ message: "No such Service category with the id provided" });
    }
    const deletedService = await ServiceCategory.findOneAndDelete({ _id: id });

    if (!deletedService) {
      return res.status(404).json({ message: "Service type not found." });
    }

    await Service.deleteMany({ catgory: id });

    return res.status(200).json({
      message: "Service category and associated Services deleted successfully.",
      deletedService,
    });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

module.exports = {
  createServiceCategory,
  getServiceCategories,
  deleteServiceCategory,
};
