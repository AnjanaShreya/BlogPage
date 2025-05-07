const MootCourt = require('../Models/MootCourt');

// Create a new moot court event
exports.createEvent = async (req, res) => {
  try {
    const newEvent = new MootCourt(req.body);
    const savedEvent = await newEvent.save();
    res.status(201).json({
      success: true,
      message: 'Moot court event created successfully',
      data: savedEvent
    });
  } catch (error) {
    console.error('Error creating moot court event:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create moot court event',
      error: error.message
    });
  }
};

// Get all moot court events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await MootCourt.find().sort({ date: 1 });
    res.status(200).json({
      success: true,
      message: 'Moot court events retrieved successfully',
      data: events
    });
  } catch (error) {
    console.error('Error fetching moot court events:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch moot court events',
      error: error.message
    });
  }
};

// Get single moot court event
exports.getEventById = async (req, res) => {
  try {
    const event = await MootCourt.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Moot court event not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Moot court event retrieved successfully',
      data: event
    });
  } catch (error) {
    console.error('Error fetching moot court event:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch moot court event',
      error: error.message
    });
  }
};

// Update moot court event
exports.updateEvent = async (req, res) => {
  try {
    const updatedEvent = await MootCourt.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedEvent) {
      return res.status(404).json({
        success: false,
        message: 'Moot court event not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Moot court event updated successfully',
      data: updatedEvent
    });
  } catch (error) {
    console.error('Error updating moot court event:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update moot court event',
      error: error.message
    });
  }
};

// Delete moot court event
exports.deleteEvent = async (req, res) => {
  try {
    const deletedEvent = await MootCourt.findByIdAndDelete(req.params.id);
    if (!deletedEvent) {
      return res.status(404).json({
        success: false,
        message: 'Moot court event not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Moot court event deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting moot court event:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete moot court event',
      error: error.message
    });
  }
};

exports.getUpcomingMootCount = async (req, res) => {
  try {
    const today = new Date();
    const count = await MootCourt.countDocuments({ date: { $gt: today } });
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching upcoming moots', error: error.message });
  }
};
