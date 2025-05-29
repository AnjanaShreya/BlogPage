const express = require("express");
const router = express.Router();
const blogController = require("../Controllers/blogController");
const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');



// Public routes
router.post("/submit", blogController.createBlog);
router.get("/blogs/pending", verifyToken, requireAdmin, blogController.getPendingBlogs);
router.get("/blogs/approved", blogController.getApprovedBlogs);
router.get("/blogs", blogController.getBlogs);

// Admin protected routes
router.put("/blogs/approve/:id", verifyToken, requireAdmin, blogController.approveBlog);
router.put("/blogs/reject/:id", verifyToken, requireAdmin, blogController.rejectBlog);
router.get("/blogs/count/pending", verifyToken, requireAdmin, blogController.countPendingBlogs);
router.put('/blogs/request-revision/:id', verifyToken, requireAdmin, blogController.requestRevision);
router.get("/blogs/count/review", verifyToken, requireAdmin, blogController.countReviewBlogs);
router.get('/blogs/review', verifyToken, requireAdmin, blogController.getReviewBlogs);

// Add these routes to your blogRoutes.js
// router.get('/blogs/review', blogController.getReviewBlogs);
router.put('/blogs/resubmit/:id', blogController.resubmitBlog);
router.get("/blogs/:id", blogController.getBlogById); 


module.exports = router;