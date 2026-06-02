const { prisma, isValidUUID, formatPrisma } = require("../config/prisma");
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const transporter = nodemailer.createTransport({
  host: 'smtp.mail.yahoo.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.YAHOO_EMAIL,
    pass: process.env.YAHOO_APP_PASSWORD
  },
  debug: true,
  logger: true
});

// Controller to fetch all blogs
const getBlogs = async (req, res) => {
  try {
    const blogs = await prisma.blog.findMany();
    res.status(200).json(formatPrisma(blogs));
  } catch (error) {
    console.error("Get Blogs Error:", error);
    res.status(500).json({ message: "Error while fetching blogs." });
  }
};

const getBlogById = async (req, res) => {
  try {
    if (!isValidUUID(req.params.id)) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid blog ID format"
      });
    }

    const blog = await prisma.blog.findFirst({ 
      where: {
        id: req.params.id,
        status: { in: ['approved', 'needs-revision'] }
      },
      include: {
        author: {
          select: {
            email: true
          }
        }
      }
    });
    
    if (!blog) {
      return res.status(404).json({ 
        success: false,
        message: "Blog not found or not approved" 
      });
    }
    
    res.status(200).json({
      success: true,
      data: formatPrisma(blog)
    });
  } catch (error) {
    console.error("Get Blog By ID Error:", error);
    res.status(500).json({ 
      success: false,
      message: "Error fetching blog.",
      error: error.message 
    });
  }
};

const createBlog = async (req, res) => {
  try {
    const { name, university, degree, year, shortBio, category, blogContent, heading } = req.body;

    // Get token from cookies
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: "Authentication required" 
      });
    }

    // Verify token and get user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id }
    });
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    const newBlog = await prisma.blog.create({
      data: {
        name,
        university,
        degree,
        year,
        shortBio,
        category,
        blogContent,
        heading,
        status: 'pending',
        authorId: user.id
      }
    });

    // Send email notification
    try {
      const mailOptions = {
        from: `Blog Platform <${process.env.YAHOO_EMAIL}>`,
        to: user.email,
        subject: 'Blog Submission Received',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2d3748;">Hello ${name || 'there'},</h2>
            <p>Your blog titled <strong>"${heading}"</strong> has been successfully submitted for approval.</p>
            <p>Our team will review your submission and notify you once it's published. This typically takes 1-2 business days.</p>
            <p>Thank you for contributing to our platform!</p>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
              <p>Best regards,</p>
              <p>The Blog Team</p>
            </div>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log('Email sent successfully');
    } catch (emailError) {
      console.error('Email sending failed:', {
        message: emailError.message,
        stack: emailError.stack,
        response: emailError.response,
        code: emailError.code
      });
    }

    res.status(201).json({ 
      success: true,
      message: "Blog submitted successfully!", 
      data: formatPrisma(newBlog) 
    });

  } catch (error) {
    console.error('Blog submission error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false,
        message: "Invalid authentication token" 
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: "Error while submitting the blog.",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// In your admin controller
const getPendingBlogs = async (req, res) => {
  try {
    const blogs = await prisma.blog.findMany({
      where: { status: 'pending' },
      include: {
        author: {
          select: { email: true }
        },
        approvedBy: {
          select: { email: true }
        }
      }
    });
    
    res.status(200).json({ 
      success: true,
      data: formatPrisma(blogs) 
    });
  } catch (error) {
    console.error("Get Pending Blogs Error:", error);
    res.status(500).json({ 
      success: false,
      message: "Error while fetching pending blogs.",
      error: error.message
    });
  }
};

// Approve a blog
const approveBlog = async (req, res) => {  
  try {
    const { id } = req.params;
    const { adminId } = req.body;

    // Validate the ID format first
    if (!isValidUUID(id)) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid blog ID format"
      });
    }

    const blog = await prisma.blog.update({
      where: { id },
      data: {
        status: 'approved',
        approvedById: adminId
      }
    });

    res.status(200).json({ 
      success: true,
      message: "Blog approved successfully", 
      data: formatPrisma(blog) 
    });
  } catch (error) {
    console.error("Approve Blog Error:", error);
    res.status(500).json({ 
      success: false,
      message: "Error approving blog.",
      error: error.message
    });
  }
};

// Reject a blog
const rejectBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminId, rejectionReason } = req.body;

    // Validate the ID format first
    if (!isValidUUID(id)) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid blog ID format"
      });
    }

    const blog = await prisma.blog.update({
      where: { id },
      data: {
        status: 'rejected',
        approvedById: adminId,
        rejectionReason
      },
      include: {
        author: {
          select: { email: true }
        }
      }
    });

    // Send rejection email to author
    if (blog.author && blog.author.email) {
      try {
        const mailOptions = {
          from: `Blog Platform <${process.env.YAHOO_EMAIL}>`,
          to: blog.author.email,
          subject: `Manuscript Rejected: ${blog.heading}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #d93025;">Hello there,</h2>
              <p>We regret to inform you that your manuscript titled <strong>"${blog.heading}"</strong> has been rejected after editorial review.</p>
              
              <div style="background-color: #fdf2f2; border-left: 4px solid #d93025; padding: 12px; margin: 15px 0;">
                <h3 style="color: #b0261d; margin-top: 0;">Rejection Feedback:</h3>
                <p style="white-space: pre-wrap;">${rejectionReason || 'No specific reasons provided.'}</p>
              </div>
              
              <p>We appreciate your interest in submitting your work to our platform. We encourage you to review our guidelines and consider submitting future research.</p>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                <p>Best regards,</p>
                <p>The Editorial Board</p>
              </div>
            </div>
          `,
        };

        await transporter.sendMail(mailOptions);
      } catch (emailError) {
        console.error('Failed to send rejection email:', emailError);
      }
    }

    res.status(200).json({ 
      success: true,
      message: "Blog rejected and author notified", 
      data: formatPrisma(blog) 
    });
  } catch (error) {
    console.error("Reject Blog Error:", error);
    res.status(500).json({ 
      success: false,
      message: "Error rejecting blog.",
      error: error.message
    });
  }
};

// Get all approved blogs
const getApprovedBlogs = async (req, res) => {
  try {
    const blogs = await prisma.blog.findMany({
      where: { status: 'approved' }
    });
    res.status(200).json({ 
      success: true,
      data: formatPrisma(blogs) 
    });
  } catch (error) {
    console.error("Get Approved Blogs Error:", error);
    res.status(500).json({ 
      success: false,
      message: "Error while fetching approved blogs.",
      error: error.message
    });
  }
};

// Count pending blogs
const countPendingBlogs = async (req, res) => {
  try {
    const count = await prisma.blog.count({
      where: { status: 'pending' }
    });
    res.status(200).json({ 
      success: true,
      count 
    });
  } catch (error) {
    console.error("Count Pending Blogs Error:", error);
    res.status(500).json({ 
      success: false,
      message: "Error counting pending blogs",
      error: error.message
    });
  }
};

const requestRevision = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminId, reviewComments } = req.body;

    if (!isValidUUID(id)) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid blog ID format"
      });
    }

    const blog = await prisma.blog.update({
      where: { id },
      data: {
        status: 'needs-revision',
        approvedById: adminId,
        reviewComments,
        isResubmitted: false,
        revisionCount: {
          increment: 1
        }
      },
      include: {
        author: {
          select: { email: true }
        }
      }
    });

    // Send email to author
    try {
      const mailOptions = {
        from: `Blog Platform <${process.env.YAHOO_EMAIL}>`,
        to: blog.author.email,
        subject: `Revision Request for Your Blog: ${blog.heading}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2d3748;">Hello there,</h2>
            <p>Your blog titled <strong>"${blog.heading}"</strong> requires revisions before it can be approved.</p>
            
            <div style="background-color: #f8fafc; border-left: 4px solid #f59e0b; padding: 12px; margin: 15px 0;">
              <h3 style="color: #d97706; margin-top: 0;">Review Comments:</h3>
              <p style="white-space: pre-wrap;">${reviewComments}</p>
            </div>
            
            <p>Please make the requested changes and resubmit your blog for review.</p>
            
            <div style="margin: 20px 0; text-align: center;">
              <a href="http://localhost:3000/reviewsubmission/${blog.id}" 
                style="background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Edit and Resubmit Your Blog
              </a>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
              <p>Best regards,</p>
              <p>The Blog Team</p>
            </div>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error('Failed to send revision email:', emailError);
    }

    res.status(200).json({ 
      success: true,
      message: "Revision requested successfully", 
      data: formatPrisma(blog) 
    });
  } catch (error) {
    console.error("Request Revision Error:", error);
    res.status(500).json({ 
      success: false,
      message: "Error requesting revision",
      error: error.message
    });
  }
};

// Count review blogs
const countReviewBlogs = async (req, res) => {
  try {
    const count = await prisma.blog.count({
      where: { status: 'needs-revision' }
    });
    res.status(200).json({ 
      success: true,
      count 
    });
  } catch (error) {
    console.error("Count Review Blogs Error:", error);
    res.status(500).json({ 
      success: false,
      message: "Error counting pending blogs",
      error: error.message
    });
  }
};

// Fetch blogs needing revision
const getReviewBlogs = async (req, res) => {
  try {
    const blogs = await prisma.blog.findMany({
      where: {
        status: "needs-revision",
        isResubmitted: true
      }
    });

    res.status(200).json({
      success: true,
      data: formatPrisma(blogs),
    });
  } catch (error) {
    console.error("Get Review Blogs Error:", error);
    res.status(500).json({
      success: false,
      message: "Error while fetching blogs needing revision.",
      error: error.message,
    });
  }
};

const resubmitBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, university, degree, year, shortBio, category, blogContent, heading } = req.body;

    if (!isValidUUID(id)) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid blog ID format"
      });
    }

    const updatedBlog = await prisma.blog.update({
      where: { id },
      data: {
        name,
        university,
        degree,
        year,
        shortBio,
        category,
        blogContent,
        heading,
        status: 'needs-revision', // Keep status as needs-revision
        isResubmitted: true,
        revisionCount: {
          increment: 1
        }
      },
      include: {
        author: {
          select: { email: true }
        }
      }
    });

    res.status(200).json({ 
      success: true,
      message: "Blog updated successfully",
      data: formatPrisma(updatedBlog) 
    });
  } catch (error) {
    console.error("Resubmit Blog Error:", error);
    res.status(500).json({ 
      success: false,
      message: "Error updating blog",
      error: error.message
    });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const totalArticles = await prisma.blog.count({ where: { status: 'approved' } });
    const pendingApprovals = await prisma.blog.count({ where: { status: 'pending' } });
    const revisionRequests = await prisma.blog.count({ where: { status: 'needs-revision' } });
    
    const today = new Date();
    const upcomingPrograms = await prisma.program.count({ where: { startDate: { gt: today } } });
    const upcomingMoots = await prisma.mootCourt.count({ where: { date: { gt: today } } });
    const upcomingEvents = upcomingPrograms + upcomingMoots;

    // Get top contributors
    const rawContributors = await prisma.blog.groupBy({
      by: ['name', 'university'],
      where: { status: 'approved' },
      _count: {
        id: true
      },
      orderBy: {
        _count: {
          id: 'desc'
        }
      },
      take: 3
    });

    const topContributors = rawContributors.map(c => ({
      name: c.name,
      university: c.university,
      articlesCount: c._count.id
    }));

    res.status(200).json({
      success: true,
      data: {
        totalArticles,
        pendingApprovals,
        revisionRequests,
        upcomingEvents,
        topContributors
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard stats',
      error: error.message
    });
  }
};

module.exports = { 
  getBlogs, 
  getBlogById, 
  createBlog, 
  getPendingBlogs, 
  approveBlog, 
  rejectBlog, 
  getApprovedBlogs,
  countPendingBlogs,
  requestRevision,
  countReviewBlogs,
  resubmitBlog,
  getReviewBlogs,
  getDashboardStats
};