const Program = require('../Models/Program');

// Get all programs
exports.getAllPrograms = async (req, res) => {
  try {
    const programs = await Program.find().sort({ startDate: 1 });
    res.status(200).json({
      success: true,
      data: programs
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch programs',
      error: err.message
    });
  }
};

// Create a new program
exports.createProgram = async (req, res) => {
  try {
    // Convert string dates to Date objects
    const programData = {
      ...req.body,
      startDate: new Date(req.body.startDate),
      endDate: new Date(req.body.endDate)
    };

    const program = new Program(programData);
    const savedProgram = await program.save();
    
    res.status(201).json({
      success: true,
      data: savedProgram
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: 'Failed to create program',
      error: err.message,
      errors: err.errors ? Object.values(err.errors).map(e => e.message) : undefined
    });
  }
};

exports.updateProgram = async (req, res) => {
  
  try {
    const updatedProgram = await Program.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedProgram) {
      return res.status(404).json({
        success: false,
        message: 'Program not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Program updated successfully',
      data: updatedProgram
    });
  } catch (error) {
    console.error('Error updating program:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update program',
      error: error.message
    });
  }
};


// Delete a program
exports.deleteProgram = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid program ID format'
      });
    }

    const deletedProgram = await Program.findByIdAndDelete(req.params.id);
    
    if (!deletedProgram) {
      return res.status(404).json({
        success: false,
        message: 'Program not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Program deleted successfully'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete program',
      error: err.message
    });
  }
};

exports.getUpcomingProgramCount = async (req, res) => {
  try {
    const today = new Date();
    const count = await Program.countDocuments({ startDate: { $gt: today } });
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching upcoming programs', error: error.message });
  }
};
