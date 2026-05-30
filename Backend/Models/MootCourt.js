const mongoose = require('mongoose');

const scheduleItemSchema = new mongoose.Schema({
  day: { type: String, required: true },
  events: { type: String, required: true }
});

const registrationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  college: { type: String, required: true },
  leader: { type: String, default: '' },
  members: { type: String, default: '' },
  status: { 
    type: String, 
    enum: ['Pending', 'Confirmed', 'Rejected'], 
    default: 'Confirmed' 
  }
}, {
  timestamps: true
});

const mootCourtSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  venue: { type: String, required: true },
  description: { type: String, required: true },
  registrationDeadline: { type: Date, required: true },
  contact: { type: String, required: true },
  teams: { type: Number, required: true },
  prizes: { type: String, required: true },
  rulesLink: { type: String },
  schedule: [scheduleItemSchema],
  registrations: [registrationSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field before saving
mootCourtSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('MootCourt', mootCourtSchema);