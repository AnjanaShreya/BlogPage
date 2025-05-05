const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../Models/User");

// Cookie options
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 3600000 // 1 hour
};

// Signup - Updated to include role
exports.signup = async (req, res) => {
  const { email, password, role } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    // Prevent admin signup without proper authorization
    if (role === 'admin' && req.body.adminSecret !== process.env.ADMIN_SECRET) {
      return res.status(403).json({ message: "Admin registration requires secret code" });
    }

    const hashed = await bcrypt.hash(password, 12);
    const newUser = await User.create({ 
      email, 
      password: hashed,
      role: role || 'user' // Default to user if not specified
    });

    const token = jwt.sign({ 
      id: newUser._id,
      role: newUser.role // Include role in token
    }, process.env.JWT_SECRET, { expiresIn: "1h" });
    
    res.cookie('token', token, cookieOptions);
    res.status(201).json({ 
      message: "User created successfully",
      role: newUser.role
    });
  } catch (err) {
    res.status(500).json({ message: "Error in Signup" });
  }
};

// Signin - Updated with role verification
exports.signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ 
      id: user._id,
      role: user.role // Include role in token
    }, process.env.JWT_SECRET, { expiresIn: "1h" });
    
    res.cookie('token', token, cookieOptions);
    res.status(200).json({ 
      message: "Logged in successfully",
      role: user.role,
      token // Optional: if you want to use it client-side
    });
  } catch (err) {
    res.status(500).json({ message: "Error in Signin" });
  }
};

// Admin-only signin endpoint
exports.adminSignin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Verify admin role
    if (user.role !== 'admin') {
      return res.status(403).json({ message: "Admin access required" });
    }

    const token = jwt.sign({ 
      id: user._id,
      role: user.role
    }, process.env.JWT_SECRET, { expiresIn: "1h" });
    
    res.cookie('token', token, cookieOptions);
    res.status(200).json({ 
      message: "Admin logged in successfully",
      role: user.role,
      token
    });
  } catch (err) {
    res.status(500).json({ message: "Error in Admin Signin" });
  }
};

// Verify Token Middleware - Updated with role
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

// Admin-only middleware
exports.requireAdmin = (req, res, next) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

// Signout - clears the token cookie
exports.signout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
  });
  res.status(200).json({ message: "Signed out successfully" });
};
