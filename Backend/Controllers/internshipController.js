const Internship = require('../Models/Internship');
const mongoose = require('mongoose');

// Get all internships
exports.getAllInternships = async (req, res) => {
  try {
    const internships = await Internship.find().sort({ startDate: 1 });
    res.status(200).json({
      success: true,
      data: internships
    });
  } catch (err) {
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
      ...req.body,
      startDate: new Date(req.body.startDate),
      endDate: new Date(req.body.endDate)
    };

    const internship = new Internship(internshipData);
    const savedInternship = await internship.save();
    
    res.status(201).json({
      success: true,
      data: savedInternship
    });
  } catch (err) {
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
    const updatedInternship = await Internship.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedInternship) {
      return res.status(404).json({
        success: false,
        message: 'Internship not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Internship updated successfully',
      data: updatedInternship
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
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid internship ID format'
      });
    }

    const deletedInternship = await Internship.findByIdAndDelete(req.params.id);
    if (!deletedInternship) {
      return res.status(404).json({
        success: false,
        message: 'Internship not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Internship deleted successfully'
    });
  } catch (err) {
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

    const internship = await Internship.findById(id);
    if (!internship) {
      return res.status(404).json({
        success: false,
        message: 'Internship not found'
      });
    }

    const application = internship.applications.id(appId);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    application.status = status;
    await internship.save();

    res.status(200).json({
      success: true,
      message: `Successfully set application status to ${status}`,
      data: internship
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

    const internship = await Internship.findById(id);
    if (!internship) {
      return res.status(404).json({
        success: false,
        message: 'Internship not found'
      });
    }

    const newApplication = {
      name,
      email,
      college,
      skills: skills || '',
      whyInterested: whyInterested || '',
      resumeLink: resumeLink || '',
      status: 'Pending'
    };

    internship.applications.push(newApplication);
    const updatedInternship = await internship.save();

    res.status(200).json({
      success: true,
      message: 'Application submitted successfully',
      data: updatedInternship
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
