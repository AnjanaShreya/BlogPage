const jwt = require('jsonwebtoken');
const { prisma } = require('../config/prisma');

const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    delete user.password;
    req.user = user;
    next();
  } catch (error) {
    console.error('JWT Verification Error:', error.message);

    let message = 'Invalid token';
    if (error.name === 'TokenExpiredError') {
      message = 'Token expired';
    } else if (error.name === 'JsonWebTokenError') {
      message = 'Invalid token format';
    }

    return res.status(401).json({
      success: false,
      message,
      error: error.message
    });
  }
};

const requireAdmin = (req, res, next) => {
  const adminRoles = ['admin', 'subadmin', 'Chief Editor', 'Blog Reviewer', 'Moot Coordinator', 'Academic Coordinator', 'Events Coordinator', 'Internships Coordinator'];
  if (!adminRoles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'Admin privileges required'
    });
  }
  next();
};

const requireSubadmin = (req, res, next) => {
  const subadminRoles = ['admin', 'subadmin', 'Chief Editor', 'Blog Reviewer'];
  if (!subadminRoles.includes(req.user.role)) {
    return res.status(403).json({ 
      success: false,
      message: 'Subadmin privileges required' 
    });
  }
  next();
};

module.exports = {
  verifyToken,
  requireAdmin,
  requireSubadmin
};
