const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  college: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Confirmed', 'Rejected'], 
    default: 'Pending' 
  },
  skills: { type: String, default: '' },
  whyInterested: { type: String, default: '' },
  resumeLink: { type: String, default: '' }
}, {
  timestamps: true
});

const internshipSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Internship title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters']
  },
  description: {
    type: String,
    required: [true, 'Internship description is required'],
    minlength: [10, 'Description must be at least 10 characters']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required'],
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required'],
  },
  programType: {
    type: String,
    default: 'internship'
  },
  status: {
    type: String,
    enum: ['Active', 'Draft', 'Completed'],
    default: 'Active'
  },
  stipend: {
    type: String,
    default: ''
  },
  duration: {
    type: String,
    default: ''
  },
  seatsAvailable: {
    type: String,
    default: ''
  },
  applications: [applicationSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('Internship', internshipSchema);
