const Blog = require("../Models/blog.model");

// Controller to fetch all blogs
const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.status(200).json(blogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error while fetching blogs." });
  }
};

// Controller to fetch a single blog by ID
const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.json(blog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching blog." });
  }
};

// Controller to create a blog
const createBlog = async (req, res) => {
  try {
    const { name, university, degree, year, shortBio, category, blogContent, heading } = req.body;

    const newBlog = new Blog({
      name,
      university,
      degree,
      year,
      shortBio,
      category,
      blogContent,
      heading,
    });

    await newBlog.save();
    res.status(201).json({ message: "Blog submitted successfully!", blog: newBlog });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error while submitting the blog." });
  }
};

module.exports = { getBlogs, getBlogById, createBlog };
