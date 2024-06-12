const express = require("express");
const {
  createPolicy,
  getPolicies,
  getPolicyById,
  updatePolicy,
  deletePolicy,
} = require("../controllers/policyController");

const router = express.Router();

router.post("/create_policy/:adminId", createPolicy);

router.get("/", getPolicies);

router.get("/:id", getPolicyById);

router.put("/:id", updatePolicy);

router.delete("/:id", deletePolicy);

module.exports = router;
