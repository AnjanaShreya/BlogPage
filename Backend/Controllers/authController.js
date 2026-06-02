const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { prisma, formatPrisma } = require("../config/prisma");

// Cookie options
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 3600000 // 1 hour
};

// Signup - Updated to include role
exports.signup = async (req, res) => {
  const { email, password, role } = req.body;
  try {
    const existing = await prisma.user.findUnique({
      where: { email }
    });
    if (existing) return res.status(400).json({ message: "User already exists" });

    // Prevent admin signup without proper authorization
    if (role === 'admin' && req.body.adminSecret !== process.env.ADMIN_SECRET) {
      return res.status(403).json({ message: "Admin registration requires secret code" });
    }

    const hashed = await bcrypt.hash(password, 12);
    const newUser = await prisma.user.create({ 
      data: {
        email, 
        password: hashed,
        role: role || 'user' // Default to user if not specified
      }
    });

    const token = jwt.sign({ 
      id: newUser.id,
      role: newUser.role // Include role in token
    }, process.env.JWT_SECRET, { expiresIn: "1h" });
    
    res.cookie('token', token, cookieOptions);
    res.status(201).json({ 
      message: "User created successfully",
      role: newUser.role
    });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ message: "Error in Signup" });
  }
};

// Signin - Updated with role verification
exports.signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: { email }
    });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ 
      id: user.id,
      role: user.role // Include role in token
    }, process.env.JWT_SECRET, { expiresIn: "1h" });
    
    res.cookie('token', token, cookieOptions);
    res.status(200).json({ 
      message: "Logged in successfully",
      role: user.role,
    });
  } catch (err) {
    console.error("Signin Error:", err);
    res.status(500).json({ message: "Error in Signin" });
  }
};

// Verify Token Middleware - Updated with role
exports.adminSignin = async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = email.trim().toLowerCase();
  
  console.log("\n🔑 [LOGIN DEBUG] Attempting admin signin:");
  console.log("- Submitted Email:", email);
  console.log("- Normalized Email:", normalizedEmail);
  
  try {
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    });
    if (!user) {
      console.log("❌ [LOGIN DEBUG] User NOT found in database.");
      return res.status(404).json({ message: "User not found" });
    }

    console.log("✅ [LOGIN DEBUG] User found:");
    console.log("- DB Role:", user.role);
    console.log("- DB Status:", user.status);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("- Password Match Result:", isMatch);
    
    if (!isMatch) {
      console.log("❌ [LOGIN DEBUG] Password did not match.");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const adminRoles = ['admin', 'subadmin', 'Chief Editor', 'Blog Reviewer', 'Moot Coordinator', 'Academic Coordinator', 'Events Coordinator', 'Internships Coordinator'];
    const hasRole = adminRoles.includes(user.role);
    console.log("- Admin/Coordinator Role check:", hasRole);

    if (!hasRole) {
      console.log("❌ [LOGIN DEBUG] Role not authorized for administrative access.");
      return res.status(403).json({ message: "Admin or coordinator access required" });
    }

    console.log("🎉 [LOGIN DEBUG] Login SUCCESS!");

    const token = jwt.sign({ 
      id: user.id,
      role: user.role
    }, process.env.JWT_SECRET, { expiresIn: "1h" });
    
    res.cookie('token', token, cookieOptions);
    res.status(200).json({ 
      message: "Logged in successfully",
      role: user.role,
      userId: user.id 
    });
  } catch (err) {
    console.error("🚨 [LOGIN DEBUG] Server Error:", err);
    res.status(500).json({ message: "Error in Signin" });
  }
};

exports.verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.userId = decoded.id;
    req.userRole = decoded.role; // Add role to request
    next();
  });
};

exports.requireAdmin = (req, res, next) => {
  const adminRoles = ['admin', 'subadmin', 'Chief Editor', 'Blog Reviewer', 'Moot Coordinator', 'Academic Coordinator', 'Events Coordinator', 'Internships Coordinator'];
  if (!adminRoles.includes(req.userRole)) {
    return res.status(403).json({ message: "Admin or subadmin access required" });
  }
  next();
};

exports.requireSubadmin = (req, res, next) => {
  const subadminRoles = ['admin', 'subadmin', 'Chief Editor', 'Blog Reviewer'];
  if (!subadminRoles.includes(req.userRole)) {
    return res.status(403).json({ 
      success: false,
      message: "Subadmin privileges required" 
    });
  }
  next();
};

// Signout - clears the token cookie
exports.signout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });
  res.status(200).json({ message: "Signed out successfully" });
};

exports.verifySession = async (req, res) => {
  try {
    const token = req.cookies.token;
    
    if (!token) {
      return res.status(200).json({ isValid: false });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id }
    });
    
    if (!user) {
      return res.status(200).json({ isValid: false });
    }

    return res.status(200).json({ 
      isValid: true,
      userId: user.id,
      role: user.role
    });
  } catch (err) {
    return res.status(200).json({ isValid: false });
  }
};

// Create a new Sub-Admin / Coordinator user
exports.createSubAdmin = async (req, res) => {
  const { email, role } = req.body;
  
  if (!email || !role) {
    return res.status(400).json({ success: false, message: "Email and role are required" });
  }

  const normalizedEmail = email.trim().toLowerCase();

  try {
    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    });
    if (existing) {
      return res.status(400).json({ success: false, message: "User with this email already exists" });
    }

    // Generate secure registration token
    const crypto = require('crypto');
    const token = crypto.randomBytes(32).toString('hex');
    const tempPassword = crypto.randomBytes(16).toString('hex');
    const hashed = await bcrypt.hash(tempPassword, 12);

    const newSubAdmin = await prisma.user.create({
      data: {
        email: normalizedEmail,
        password: hashed,
        role: role,
        status: 'Pending Invite',
        inviteToken: token
      }
    });

    // Send email using nodemailer
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
      host: 'smtp.mail.yahoo.com',
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.YAHOO_EMAIL,
        pass: process.env.YAHOO_APP_PASSWORD
      },
      debug: true,
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
      tls: {
        rejectUnauthorized: false
      }
    });

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const setupUrl = `${frontendUrl}/admin/setup-password?email=${encodeURIComponent(normalizedEmail)}&token=${token}`;
    
    const mailOptions = {
      from: process.env.YAHOO_EMAIL,
      to: normalizedEmail,
      subject: 'LexScripta Platform - Invitation to Join Administrative Board',
      text: `Hello, you have been invited to join the LexScripta administrative board.\n\nRole: ${role}\n\nSet up your password and configure your account at: ${setupUrl}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e5e7eb; border-radius: 12px; background-color: #ffffff;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h2 style="color: #002a32; font-family: Georgia, serif; margin: 0; font-size: 28px;">LexScripta</h2>
            <p style="color: #8c6d23; text-transform: uppercase; font-size: 10px; font-weight: bold; letter-spacing: 0.15em; margin: 4px 0 0 0;">Legal Publishing Platform</p>
          </div>
          <div style="height: 3px; background-color: #8c6d23; border-radius: 2px; margin-bottom: 24px;"></div>
          <p style="color: #374151; font-size: 15px; line-height: 1.6;">Hello,</p>
          <p style="color: #374151; font-size: 15px; line-height: 1.6;">You have been invited to join the <strong>LexScripta Legal Publishing Platform</strong> board as a <strong>${role}</strong>.</p>
          <p style="color: #374151; font-size: 15px; line-height: 1.6;">To complete your registration and configure your private login password, please click the secure button below:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${setupUrl}" style="background-color: #002a32; color: #ecc260; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 15px; display: inline-block; box-shadow: 0 4px 6px rgba(0,0,0,0.08);">Configure Account Password</a>
          </div>
          
          <p style="color: #6b7280; font-size: 12px; line-height: 1.5; text-align: center;">If the button above does not work, copy and paste the following URL into your browser:<br>
          <a href="${setupUrl}" style="color: #002a32; word-break: break-all;">${setupUrl}</a></p>
          
          <div style="border-top: 1px solid #f3f4f6; padding-top: 20px; font-size: 12px; color: #9ca3af; text-align: center; margin-top: 30px;">
            &copy; 2026 LexScripta Legal Publishing. All rights reserved.
          </div>
        </div>
      `
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (mailErr) {
      console.error("Mail Send Error (Handled Gracefully):", mailErr.message);
      console.log("\n🔑 [LOCAL DEV ONLY] Setup link for testing:\n", setupUrl, "\n");
    }

    res.status(201).json({
      success: true,
      message: `Invitation successfully sent to ${email}!`,
      user: { email: newSubAdmin.email, role: newSubAdmin.role }
    });
  } catch (error) {
    console.error("Create Sub-Admin Error:", error);
    res.status(500).json({ success: false, message: "Failed to create sub-admin" });
  }
};

// Retrieve all administrative / sub-admin accounts
exports.getSubAdmins = async (req, res) => {
  try {
    const subadmins = await prisma.user.findMany({
      where: {
        role: {
          not: "user"
        }
      }
    });
    
    // Remove passwords
    subadmins.forEach(user => {
      delete user.password;
    });

    res.status(200).json({ 
      success: true, 
      subadmins: formatPrisma(subadmins) 
    });
  } catch (error) {
    console.error("Get Sub-Admins Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch sub-admins" });
  }
};

// Revoke access / Delete sub-admin account
exports.deleteSubAdmin = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await prisma.user.delete({
      where: { id }
    });
    
    res.status(200).json({ success: true, message: "Access successfully revoked" });
  } catch (error) {
    console.error("Delete Sub-Admin Error:", error);
    res.status(500).json({ success: false, message: "Failed to delete sub-admin" });
  }
};

// Set password using invitation token
exports.setupPassword = async (req, res) => {
  const { email, token, password } = req.body;
  
  if (!email || !token || !password) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  const normalizedEmail = email.trim().toLowerCase();

  try {
    const user = await prisma.user.findFirst({
      where: {
        email: normalizedEmail,
        inviteToken: token
      }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired invitation link" });
    }

    const hashed = await bcrypt.hash(password, 12);
    
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashed,
        status: "Active"
      }
    });

    res.status(200).json({ success: true, message: "Password updated successfully! You can now log in." });
  } catch (error) {
    console.error("Setup Password Error:", error);
    res.status(500).json({ success: false, message: "Failed to save password" });
  }
};