const express = require("express");
const router = express.Router();
const blogController = require("../Controllers/blogController");
const { verifyToken, requireAdmin } = require('../Middleware/authMiddleware');



// Public routes
router.post("/submit", blogController.createBlog);
router.get("/blogs/pending", verifyToken, requireAdmin, blogController.getPendingBlogs);
router.get("/blogs/approved", blogController.getApprovedBlogs);
router.get("/blogs", blogController.getBlogs);
router.get("/blogs/:id", blogController.getBlogById); 

// Admin protected routes
router.put("/blogs/approve/:id", verifyToken, requireAdmin, blogController.approveBlog);
router.put("/blogs/reject/:id", verifyToken, requireAdmin, blogController.rejectBlog);
router.get("/blogs/count/pending", verifyToken, requireAdmin, blogController.countPendingBlogs);

module.exports = router;