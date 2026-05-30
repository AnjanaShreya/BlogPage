const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  password: { 
    type: String, 
    required: true,
    minlength: 6
  },
  role: { 
    type: String, 
    required: true,
    enum: ['admin', 'user', 'subadmin', 'Chief Editor', 'Blog Reviewer', 'Moot Coordinator', 'Academic Coordinator', 'Events Coordinator', 'Internships Coordinator'],
    default: 'user'
  },
  status: {
    type: String,
    enum: ['Active', 'Pending Invite'],
    default: 'Active'
  },
  inviteToken: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("User", userSchema);