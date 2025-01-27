const Blog = require("../Models/blog.model");

const createBlog = async (req, res) => {
  try {
    const { name, university, degree, year, shortBio, category, blogContent } = req.body;

    const newBlog = new Blog({
      name,
      university,
      degree,
      year,
      shortBio,
      category,
      blogContent,
    });

    await newBlog.save();
    res.status(201).json({ message: "Blog submitted successfully!", blog: newBlog });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error while submitting the blog." });
  }
};

module.exports = { createBlog };
