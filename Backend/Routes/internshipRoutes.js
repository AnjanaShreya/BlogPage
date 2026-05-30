const express = require('express');
const internshipController = require('../Controllers/internshipController');
const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/', internshipController.getAllInternships);
router.post('/:id/apply', internshipController.applyToInternship);

// Protected admin routes
router.post('/', verifyToken, requireAdmin, internshipController.createInternship);
router.put('/:id', verifyToken, requireAdmin, internshipController.updateInternship);
router.delete('/:id', verifyToken, requireAdmin, internshipController.deleteInternship);
router.put('/:id/applications/:appId', verifyToken, requireAdmin, internshipController.updateApplicationStatus);

module.exports = router;
