const express = require("express");
const router = express.Router();
const { createBlog } = require("../Controllers/blog.controller");

router.post("/submit", createBlog);

module.exports = router;
