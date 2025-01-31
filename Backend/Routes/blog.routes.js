const express = require("express");
const router = express.Router();
const { createBlog, getBlogs, getBlogById } = require("../Controllers/blog.controller");

router.get("/blogs", getBlogs);

router.get("/blogs/:id", getBlogById);

router.post("/submit", createBlog);

module.exports = router;
