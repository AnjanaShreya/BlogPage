const express = require("express");
const router = express.Router();
const { createBlog, getBlogs } = require("../Controllers/blog.controller");

router.get("/blogs", getBlogs);

router.post("/submit", createBlog);

module.exports = router;
