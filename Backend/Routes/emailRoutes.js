const express = require('express');
const router = express.Router();
const { verifyToken, requireAdmin } = require('../Middleware/authMiddleware');
const { sendEmail } = require('../Controllers/emailController');

router.post('/send-email', verifyToken, requireAdmin, sendEmail);

module.exports = router;
