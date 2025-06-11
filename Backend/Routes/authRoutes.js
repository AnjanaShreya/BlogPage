const express = require("express");
const { 
  signup, 
  signin, 
  adminSignin,
  signout, 
  verifyToken,
  requireAdmin ,
  requireSubadmin,
  verifySession
} = require("../Controllers/authController");

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/admin/signin", adminSignin);
router.post("/signout", signout);
router.get('/verify-session', verifySession);

router.get("/admin/dashboard", verifyToken, requireAdmin, (req, res) => {
  res.json({ 
    message: "Welcome to admin dashboard",
    userId: req.userId
  });
});

router.get("/admin/onlyblogreview", verifyToken, requireSubadmin, (req, res) => {
  res.json({ 
    success: true,
    message: "Welcome to blog review dashboard",
    user: {
      id: req.userId,
      role: req.userRole
    }
  });
});

module.exports = router;