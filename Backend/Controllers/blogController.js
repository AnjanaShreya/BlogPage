const mongoose = require('mongoose');
const Blog = require("../Models/blogModel");
const User = require("../Models/User");
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const transporter = nodemailer.createTransport({
  host: 'smtp.mail.yahoo.com',
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.YAHOO_EMAIL,
    pass: process.env.YAHOO_APP_PASSWORD
  },
  debug: true // This will show detailed logs
});

// Controller to fetch all blogs
const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.status(200).json(blogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error while fetching blogs." });
  }
};

// const getBlogById = async (req, res) => {
//   try {
//     // Validate the ID format first
//     if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
//       return res.status(400).json({ 
//         success: false,
//         message: "Invalid blog ID format",
//         error: `Expected 24-character hex string, got ${req.params.id}`
//       });
//     }

//     const blog = await Blog.findOne({ 
//       _id: req.params.id,
//       status: 'approved' // Only find approved blogs
//     });
    
//     if (!blog) {
//       return res.status(404).json({ 
//         success: false,
//         message: "Blog not found or not approved" 
//       });
//     }
    
//     res.status(200).json({
//       success: true,
//       data: blog
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ 
//       success: false,
//       message: "Error fetching blog.",
//       error: error.message 
//     });
//   }
// };

const getBlogById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid blog ID format"
      });
    }

    const blog = await Blog.findOne({ 
      _id: req.params.id,
      status: 'approved'
    }).populate('author', 'email'); // Populate author's email
    
    if (!blog) {
      return res.status(404).json({ 
        success: false,
        message: "Blog not found or not approved" 
      });
    }
    
    res.status(200).json({
      success: true,
      data: blog
    });
  } catch (error) {
    console.error(error);
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
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    const newBlog = new Blog({
      name,
      university,
      degree,
      year,
      shortBio,
      category,
      blogContent,
      heading,
      status: 'pending',
      author: user._id
    });

    await newBlog.save();

    // Send email notification
    try {
      const mailOptions = {
        from: `Blog Platform <${process.env.YAHOO_EMAIL}>`, // Changed from EMAIL_USER to YAHOO_EMAIL
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
        message: emailError.message,  // Fixed: using emailError instead of error
        stack: emailError.stack,
        response: emailError.response,
        code: emailError.code
      });
      // Continue even if email fails
    }

    res.status(201).json({ 
      success: true,
      message: "Blog submitted successfully!", 
      data: newBlog 
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
    const blogs = await Blog.find({ status: 'pending' })
      .populate('author', 'email') // Populate author's email
      .populate('approvedBy', 'email'); // If needed
    
    res.status(200).json({ 
      success: true,
      data: blogs 
    });
  } catch (error) {
    console.error(error);
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
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid blog ID format"
      });
    }

    const blog = await Blog.findByIdAndUpdate(
      id,
      { 
        status: 'approved',
        approvedBy: adminId
      },
      { new: true }
    );

    if (!blog) {
      return res.status(404).json({ 
        success: false,
        message: "Blog not found" 
      });
    }

    res.status(200).json({ 
      success: true,
      message: "Blog approved successfully", 
      data: blog 
    });
  } catch (error) {
    console.error(error);
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
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid blog ID format"
      });
    }

    const blog = await Blog.findByIdAndUpdate(
      id,
      { 
        status: 'rejected',
        approvedBy: adminId,
        rejectionReason
      },
      { new: true }
    );

    if (!blog) {
      return res.status(404).json({ 
        success: false,
        message: "Blog not found" 
      });
    }

    res.status(200).json({ 
      success: true,
      message: "Blog rejected", 
      data: blog 
    });
  } catch (error) {
    console.error(error);
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
    const blogs = await Blog.find({ status: 'approved' });
    res.status(200).json({ 
      success: true,
      data: blogs 
    });
  } catch (error) {
    console.error(error);
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
    const count = await Blog.countDocuments({ status: 'pending' });
    res.status(200).json({ 
      success: true,
      count 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false,
      message: "Error counting pending blogs",
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
  countPendingBlogs
};