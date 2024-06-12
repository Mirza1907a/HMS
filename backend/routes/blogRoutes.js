const express = require("express");
const {
  getAllBlogs,
  createBlog,
  deleteBlog,
  updateBlog,
} = require("../controllers/blogController");

const router = express.Router();
router.post("/create", createBlog);
router.get("/", getAllBlogs);
router.put("/:id", updateBlog);
router.delete("/:id", deleteBlog);

module.exports = router;
