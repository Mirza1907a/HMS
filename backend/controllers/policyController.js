const Policy = require("../models/policyModel");
const User = require("../models/userModel");

const createPolicy = async (req, res) => {
  try {
    const { adminId } = req.params;

    const user = User.findById(adminId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No user found with the id provided",
      });
    }

    const policy = new Policy({ ...req.body, createdBy: adminId });
    await policy.save();
    const populatedPolicy = await Policy.findById(policy._id).populate(
      "createdBy",
      "first_name"
    );
    res.status(201).json(populatedPolicy);
  } catch (error) {
    res.status(400).json({ message: "Error creating policy", error });
  }
};

const getPolicies = async (req, res) => {
  try {
    const policies = await Policy.find().populate("createdBy", "first_name");
    res.status(200).json({ success: true, policies });
  } catch (error) {
    res.status(400).json({ message: "Error fetching policies", error });
  }
};

const getPolicyById = async (req, res) => {
  try {
    const policy = await Policy.findById(req.params.id);
    if (!policy) {
      return res.status(404).json({ message: "Policy not found" });
    }
    res.status(200).json(policy);
  } catch (error) {
    res.status(400).json({ message: "Error fetching policy", error });
  }
};

const updatePolicy = async (req, res) => {
  try {
    const policy = await Policy.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!policy) {
      return res.status(404).json({ message: "Policy not found" });
    }
    res.status(200).json(policy);
  } catch (error) {
    res.status(400).json({ message: "Error updating policy", error });
  }
};

const deletePolicy = async (req, res) => {
  try {
    const policy = await Policy.findByIdAndDelete(req.params.id);
    if (!policy) {
      return res.status(404).json({ message: "Policy not found" });
    }
    res.status(200).json({ message: "Policy deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Error deleting policy", error });
  }
};

module.exports = {
  createPolicy,
  deletePolicy,
  updatePolicy,
  getPolicies,
  getPolicyById,
};
