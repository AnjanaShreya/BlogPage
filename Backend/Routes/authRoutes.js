const express = require("express");
const { 
  signup, 
  signin, 
  adminSignin,
  signout, 
  verifyToken,
  requireAdmin 
} = require("../Controllers/authController");

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/admin/signin", adminSignin);
router.post("/signout", signout);

router.get("/admin/dashboard", verifyToken, requireAdmin, (req, res) => {
  res.json({ 
    message: "Welcome to admin dashboard",
    userId: req.userId
  });
});

module.exports = router;