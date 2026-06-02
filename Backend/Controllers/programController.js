const { prisma, isValidUUID, formatPrisma } = require('../config/prisma');

// Get all programs
exports.getAllPrograms = async (req, res) => {
  try {
    const programs = await prisma.program.findMany({
      orderBy: { startDate: 'asc' },
      include: {
        applications: true
      }
    });
    
    res.status(200).json({
      success: true,
      data: formatPrisma(programs)
    });
  } catch (err) {
    console.error('Error fetching programs:', err);
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
    const programData = {
      title: req.body.title,
      description: req.body.description,
      startDate: new Date(req.body.startDate),
      endDate: new Date(req.body.endDate),
      programType: req.body.programType || 'summer',
      status: req.body.status || 'Active',
      hostInstitution: req.body.hostInstitution || '',
      programFee: req.body.programFee || '',
      speakerName: req.body.speakerName || '',
      maxCapacity: req.body.maxCapacity || '',
      liveSessionLink: req.body.liveSessionLink || '',
      prizePool: req.body.prizePool || '',
      courtVenue: req.body.courtVenue || '',
      enrollmentType: req.body.enrollmentType || 'Individual',
      capacityType: req.body.capacityType || 'Unlimited',
      stipend: req.body.stipend || '',
      duration: req.body.duration || '',
      seatsAvailable: req.body.seatsAvailable || ''
    };

    const savedProgram = await prisma.program.create({
      data: programData,
      include: {
        applications: true
      }
    });
    
    res.status(201).json({
      success: true,
      data: formatPrisma(savedProgram)
    });
  } catch (err) {
    console.error('Error creating program:', err);
    res.status(400).json({
      success: false,
      message: 'Failed to create program',
      error: err.message
    });
  }
};

// Update program
exports.updateProgram = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidUUID(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid program ID format'
      });
    }

    const updateData = {
      title: req.body.title,
      description: req.body.description,
      startDate: req.body.startDate ? new Date(req.body.startDate) : undefined,
      endDate: req.body.endDate ? new Date(req.body.endDate) : undefined,
      programType: req.body.programType,
      status: req.body.status,
      hostInstitution: req.body.hostInstitution,
      programFee: req.body.programFee,
      speakerName: req.body.speakerName,
      maxCapacity: req.body.maxCapacity,
      liveSessionLink: req.body.liveSessionLink,
      prizePool: req.body.prizePool,
      courtVenue: req.body.courtVenue,
      enrollmentType: req.body.enrollmentType,
      capacityType: req.body.capacityType,
      stipend: req.body.stipend,
      duration: req.body.duration,
      seatsAvailable: req.body.seatsAvailable
    };

    // Clean undefined fields from updateData
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

    const updatedProgram = await prisma.program.update({
      where: { id },
      data: updateData,
      include: {
        applications: true
      }
    });

    res.status(200).json({
      success: true,
      message: 'Program updated successfully',
      data: formatPrisma(updatedProgram)
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
    const { id } = req.params;
    if (!isValidUUID(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid program ID format'
      });
    }

    await prisma.program.delete({
      where: { id }
    });
    
    res.status(200).json({
      success: true,
      message: 'Program deleted successfully'
    });
  } catch (err) {
    console.error('Error deleting program:', err);
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
    const count = await prisma.program.count({
      where: {
        startDate: { gt: today }
      }
    });
    res.status(200).json({ count });
  } catch (error) {
    console.error('Error fetching upcoming program count:', error);
    res.status(500).json({ message: 'Error fetching upcoming programs', error: error.message });
  }
};

// Update application status inside a program
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { id, appId } = req.params;
    const { status } = req.body; // 'Confirmed', 'Rejected', or 'Pending'

    if (!['Confirmed', 'Rejected', 'Pending'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid application status value'
      });
    }

    if (!isValidUUID(id) || !isValidUUID(appId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format'
      });
    }

    const programCheck = await prisma.program.findUnique({
      where: { id }
    });

    if (!programCheck) {
      return res.status(404).json({
        success: false,
        message: 'Program not found'
      });
    }

    const applicationCheck = await prisma.programApplication.findUnique({
      where: { id: appId }
    });

    if (!applicationCheck) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    await prisma.programApplication.update({
      where: { id: appId },
      data: { status }
    });

    const updatedProgram = await prisma.program.findUnique({
      where: { id },
      include: {
        applications: true
      }
    });

    res.status(200).json({
      success: true,
      message: `Successfully set application status to ${status}`,
      data: formatPrisma(updatedProgram)
    });
  } catch (error) {
    console.error('Error in updateApplicationStatus:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update application status',
      error: error.message
    });
  }
};

// Candidate applying to a program
exports.applyToProgram = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, college, skills, whyInterested, resumeLink } = req.body;

    if (!name || !email || !college) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and college are required fields'
      });
    }

    if (!isValidUUID(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid program ID format'
      });
    }

    const program = await prisma.program.findUnique({
      where: { id }
    });

    if (!program) {
      return res.status(404).json({
        success: false,
        message: 'Program not found'
      });
    }

    // Add candidate application
    await prisma.programApplication.create({
      data: {
        programId: id,
        name,
        email,
        college,
        skills: skills || '',
        whyInterested: whyInterested || '',
        resumeLink: resumeLink || '',
        status: 'Pending'
      }
    });

    const updatedProgram = await prisma.program.findUnique({
      where: { id },
      include: {
        applications: true
      }
    });

    res.status(200).json({
      success: true,
      message: 'Application submitted successfully',
      data: formatPrisma(updatedProgram)
    });
  } catch (error) {
    console.error('Error applying to program:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit application',
      error: error.message
    });
  }
};
