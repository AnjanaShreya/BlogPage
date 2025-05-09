const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    author: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User',
      required: true 
    },
    name: { type: String, required: true },
    university: { type: String, required: true },
    degree: { type: String, required: true },
    year: { type: String, required: true },
    shortBio: { type: String, required: true },
    category: { type: String, required: true },
    blogContent: { type: String, required: true },
    heading: { type: String, required: true },
    status: { 
      type: String, 
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rejectionReason: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);