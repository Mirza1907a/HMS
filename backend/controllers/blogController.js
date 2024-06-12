// controllers/blogController.js
const Blog = require("../models/blogModel");
const { sendNotificationToAllGuests } = require("./notificationController");

const createBlog = async (req, res) => {
  const { title, content, author, serviceId } = req.body;

  try {
    const newBlog = new Blog({
      title,
      content,
      author,
      serviceId,
    });

    await newBlog.save();

    res
      .status(201)
      .json({ message: "Blog created successfully", blog: newBlog });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating blog", error: error.message });
  }
};

const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching blogs", error: error.message });
  }
};

const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(200).json(blog);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching blog", error: error.message });
  }
};

const updateBlog = async (req, res) => {
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res
      .status(200)
      .json({ message: "Blog updated successfully", blog: updatedBlog });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating blog", error: error.message });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
    if (!deletedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting blog", error: error.message });
  }
};
const createBlogUtil = async ({
  req,
  title,
  content,
  image,
  author,
  serviceId,
  roomId,
  notifyGuests,
}) => {
  console.log(title, content, image, author, roomId, notifyGuests);
  try {
    const newBlog = new Blog({
      title: title,
      content: content,
      author: author,
      serviceId: serviceId,
      roomId: roomId,
    });
    await newBlog.save();

    if (notifyGuests) {
      await sendNotificationToAllGuests(req, "New Blog Post!", content, " ");
    }
    return newBlog;
  } catch (error) {
    throw new Error("Error creating blog: " + error.message);
  }
};

module.exports = {
  createBlog,
  createBlogUtil,
  deleteBlog,
  updateBlog,
  getAllBlogs,
};
