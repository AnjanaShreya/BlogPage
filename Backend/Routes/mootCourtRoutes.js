const express = require('express');
const router = express.Router();
const mootCourtController = require('../Controllers/mootCourtController');
const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');

// Public routes
router.get('/', mootCourtController.getAllEvents);
router.get('/:id', mootCourtController.getEventById);

// Protected admin routes
router.post('/', verifyToken, requireAdmin, mootCourtController.createEvent);
router.put('/:id', verifyToken, requireAdmin, mootCourtController.updateEvent);
router.delete('/:id', verifyToken, requireAdmin, mootCourtController.deleteEvent);
router.get('/count/upcoming', mootCourtController.getUpcomingMootCount);

module.exports = router;