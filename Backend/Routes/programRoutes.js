const express = require('express');
const programController = require('../Controllers/programController');
const { verifyToken, requireAdmin } = require('../Middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/', programController.getAllPrograms);

// Protected admin routes
router.post('/', verifyToken, requireAdmin, programController.createProgram);
router.put('/:id', verifyToken, requireAdmin, programController.updateProgram);
router.delete('/:id', verifyToken, requireAdmin, programController.deleteProgram);
router.get('/count/upcoming', programController.getUpcomingProgramCount);

module.exports = router;