const { prisma, isValidUUID, formatPrisma } = require('../config/prisma');

// Get all internships
exports.getAllInternships = async (req, res) => {
  try {
    const internships = await prisma.internship.findMany({
      orderBy: { startDate: 'asc' },
      include: {
        applications: true
      }
    });
    res.status(200).json({
      success: true,
      data: formatPrisma(internships)
    });
  } catch (err) {
    console.error('Error fetching internships:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch internships',
      error: err.message
    });
  }
};

// Create a new internship
exports.createInternship = async (req, res) => {
  try {
    const internshipData = {
      title: req.body.title,
      description: req.body.description,
      startDate: new Date(req.body.startDate),
      endDate: new Date(req.body.endDate),
      programType: req.body.programType || 'internship',
      status: req.body.status || 'Active',
      stipend: req.body.stipend || '',
      duration: req.body.duration || '',
      seatsAvailable: req.body.seatsAvailable || ''
    };

    const savedInternship = await prisma.internship.create({
      data: internshipData,
      include: {
        applications: true
      }
    });
    
    res.status(201).json({
      success: true,
      data: formatPrisma(savedInternship)
    });
  } catch (err) {
    console.error('Error creating internship:', err);
    res.status(400).json({
      success: false,
      message: 'Failed to create internship',
      error: err.message
    });
  }
};

// Update an internship
exports.updateInternship = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidUUID(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid internship ID format'
      });
    }

    const updateData = {
      title: req.body.title,
      description: req.body.description,
      startDate: req.body.startDate ? new Date(req.body.startDate) : undefined,
      endDate: req.body.endDate ? new Date(req.body.endDate) : undefined,
      programType: req.body.programType,
      status: req.body.status,
      stipend: req.body.stipend,
      duration: req.body.duration,
      seatsAvailable: req.body.seatsAvailable
    };

    // Clean undefined fields from updateData
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

    const updatedInternship = await prisma.internship.update({
      where: { id },
      data: updateData,
      include: {
        applications: true
      }
    });

    res.status(200).json({
      success: true,
      message: 'Internship updated successfully',
      data: formatPrisma(updatedInternship)
    });
  } catch (error) {
    console.error('Error updating internship:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update internship',
      error: error.message
    });
  }
};

// Delete an internship
exports.deleteInternship = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidUUID(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid internship ID format'
      });
    }

    await prisma.internship.delete({
      where: { id }
    });

    res.status(200).json({
      success: true,
      message: 'Internship deleted successfully'
    });
  } catch (err) {
    console.error('Error deleting internship:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to delete internship',
      error: err.message
    });
  }
};

// Update application status inside an internship
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

    const internshipCheck = await prisma.internship.findUnique({
      where: { id }
    });

    if (!internshipCheck) {
      return res.status(404).json({
        success: false,
        message: 'Internship not found'
      });
    }

    const applicationCheck = await prisma.internshipApplication.findUnique({
      where: { id: appId }
    });

    if (!applicationCheck) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    await prisma.internshipApplication.update({
      where: { id: appId },
      data: { status }
    });

    const updatedInternship = await prisma.internship.findUnique({
      where: { id },
      include: {
        applications: true
      }
    });

    res.status(200).json({
      success: true,
      message: `Successfully set application status to ${status}`,
      data: formatPrisma(updatedInternship)
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

// Candidate applying to an internship
exports.applyToInternship = async (req, res) => {
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
        message: 'Invalid internship ID format'
      });
    }

    const internship = await prisma.internship.findUnique({
      where: { id }
    });

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: 'Internship not found'
      });
    }

    await prisma.internshipApplication.create({
      data: {
        internshipId: id,
        name,
        email,
        college,
        skills: skills || '',
        whyInterested: whyInterested || '',
        resumeLink: resumeLink || '',
        status: 'Pending'
      }
    });

    const updatedInternship = await prisma.internship.findUnique({
      where: { id },
      include: {
        applications: true
      }
    });

    res.status(200).json({
      success: true,
      message: 'Application submitted successfully',
      data: formatPrisma(updatedInternship)
    });
  } catch (error) {
    console.error('Error applying to internship:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit application',
      error: error.message
    });
  }
};
