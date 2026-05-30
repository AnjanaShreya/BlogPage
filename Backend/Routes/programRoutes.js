const express = require('express');
const programController = require('../Controllers/programController');
const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/', programController.getAllPrograms);
router.post('/:id/apply', programController.applyToProgram);

// Protected admin routes
router.post('/', verifyToken, requireAdmin, programController.createProgram);
router.put('/:id', verifyToken, requireAdmin, programController.updateProgram);
router.delete('/:id', verifyToken, requireAdmin, programController.deleteProgram);
router.get('/count/upcoming', programController.getUpcomingProgramCount);
router.put('/:id/applications/:appId', verifyToken, requireAdmin, programController.updateApplicationStatus);

module.exports = router;