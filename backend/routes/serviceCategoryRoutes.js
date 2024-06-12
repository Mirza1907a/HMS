const { createServiceCategory,getServiceCategories,deleteServiceCategory } = require('../controllers/serviceCategoryController');
const express = require('express');


const router = express.Router();

router.get("/",getServiceCategories)
router.post("/insert",createServiceCategory);
router.delete("/delete/:id",deleteServiceCategory)

module.exports = router;