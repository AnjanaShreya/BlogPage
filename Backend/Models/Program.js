const mongoose = require('mongoose');

const programSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Program title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters']
  },
  description: {
    type: String,
    required: [true, 'Program description is required'],
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
    required: true,
    enum: {
      values: ['summer', 'winter'],
      message: 'Program type must be either summer or winter'
    },
    default: 'summer'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Program', programSchema);