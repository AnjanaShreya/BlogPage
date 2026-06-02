require('dotenv').config();
const express = require('express');
const { prisma } = require('./config/prisma');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const authRoutes = require('./Routes/authRoutes');
const blogRoutes = require('./Routes/blogRoutes');
const mootCourtRoutes = require('./Routes/mootCourtRoutes');
const programRoutes = require('./Routes/programRoutes');
const internshipRoutes = require('./Routes/internshipRoutes');
const emailRoutes = require('./Routes/emailRoutes');

const app = express();

// Database connection
prisma.$connect()
  .then(async () => {
    console.log('✅ Neon PostgreSQL (Prisma) connected successfully');
    
    // Auto-fix/restore setup-password token for user 'nicimid755@doreact.com' if needed
    try {
      const email = 'nicimid755@doreact.com';
      const token = '6f27f5eb48ec8bfb8f832676abea1bc02bcd3cf8e28621736534c9485bfb28bf';
      const user = await prisma.user.findUnique({ where: { email } });
      if (user && user.inviteToken !== token) {
        await prisma.user.update({
          where: { email },
          data: { inviteToken: token }
        });
        console.log(`🔧 Restored inviteToken for ${email} successfully.`);
      }
    } catch (dbErr) {
      console.error('Failed to restore inviteToken for user:', dbErr);
    }
  })
  .catch(err => {
    console.error('❌ Neon PostgreSQL connection error:', err);
    process.exit(1);
  });

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/auth', authRoutes);
app.use('/api', blogRoutes);
app.use('/api/moot-courts', mootCourtRoutes);
app.use('/api/programs', programRoutes);
app.use('/api/internships', internshipRoutes);
app.use('/api/email', emailRoutes);

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ 
      status: 'OK',
      database: 'Connected'
    });
  } catch (err) {
    res.status(500).json({ 
      status: 'Error',
      database: 'Disconnected',
      error: err.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('🚨 Error:', err.stack);
  res.status(500).json({ 
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`⚙️ Environment: ${process.env.NODE_ENV || 'development'}`);
});