const { prisma, isValidUUID, formatPrisma } = require('../config/prisma');

// Create a new moot court event
exports.createEvent = async (req, res) => {
  try {
    const { title, date, venue, description, registrationDeadline, contact, teams, prizes, rulesLink, schedule } = req.body;

    const savedEvent = await prisma.mootCourt.create({
      data: {
        title,
        date: new Date(date),
        venue,
        description,
        registrationDeadline: new Date(registrationDeadline),
        contact,
        teams: Number(teams),
        prizes,
        rulesLink,
        schedule: schedule && Array.isArray(schedule) ? {
          create: schedule.map(s => ({
            day: s.day,
            events: s.events
          }))
        } : undefined
      },
      include: {
        schedule: true,
        registrations: true
      }
    });

    res.status(201).json({
      success: true,
      message: 'Moot court event created successfully',
      data: formatPrisma(savedEvent)
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
    const events = await prisma.mootCourt.findMany({
      orderBy: { date: 'asc' },
      include: {
        schedule: true,
        registrations: true
      }
    });

    res.status(200).json({
      success: true,
      message: 'Moot court events retrieved successfully',
      data: formatPrisma(events)
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
    const { id } = req.params;
    if (!isValidUUID(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid moot court ID format'
      });
    }

    const event = await prisma.mootCourt.findUnique({
      where: { id },
      include: {
        schedule: true,
        registrations: true
      }
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Moot court event not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Moot court event retrieved successfully',
      data: formatPrisma(event)
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
    const { id } = req.params;
    if (!isValidUUID(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid moot court ID format'
      });
    }

    const { title, date, venue, description, registrationDeadline, contact, teams, prizes, rulesLink, schedule } = req.body;

    const updatedEvent = await prisma.$transaction(async (tx) => {
      // Clear old schedule if a new schedule array is supplied (Mongoose-style complete replace)
      if (schedule && Array.isArray(schedule)) {
        await tx.mootCourtSchedule.deleteMany({
          where: { mootCourtId: id }
        });
      }

      return await tx.mootCourt.update({
        where: { id },
        data: {
          title,
          date: date ? new Date(date) : undefined,
          venue,
          description,
          registrationDeadline: registrationDeadline ? new Date(registrationDeadline) : undefined,
          contact,
          teams: teams !== undefined ? Number(teams) : undefined,
          prizes,
          rulesLink,
          schedule: schedule && Array.isArray(schedule) ? {
            create: schedule.map(s => ({
              day: s.day,
              events: s.events
            }))
          } : undefined
        },
        include: {
          schedule: true,
          registrations: true
        }
      });
    });

    res.status(200).json({
      success: true,
      message: 'Moot court event updated successfully',
      data: formatPrisma(updatedEvent)
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
    const { id } = req.params;
    if (!isValidUUID(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid moot court ID format'
      });
    }

    // Cascade deletions are set up at the PostgreSQL level in the schema
    await prisma.mootCourt.delete({
      where: { id }
    });

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
    const count = await prisma.mootCourt.count({
      where: {
        date: { gt: today }
      }
    });
    res.status(200).json({ count });
  } catch (error) {
    console.error('Error fetching upcoming moots count:', error);
    res.status(500).json({ message: 'Error fetching upcoming moots', error: error.message });
  }
};

// Register for a moot court event
exports.registerForEvent = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidUUID(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid moot court ID format'
      });
    }

    const { name, email, college, leader, members } = req.body;

    const eventCheck = await prisma.mootCourt.findUnique({
      where: { id }
    });

    if (!eventCheck) {
      return res.status(404).json({
        success: false,
        message: 'Moot court event not found'
      });
    }

    // Add the registration
    await prisma.mootCourtRegistration.create({
      data: {
        mootCourtId: id,
        name,
        email,
        college,
        leader: leader || name,
        members: members || '',
        status: 'Confirmed'
      }
    });

    const updatedEvent = await prisma.mootCourt.findUnique({
      where: { id },
      include: {
        schedule: true,
        registrations: true
      }
    });

    res.status(200).json({
      success: true,
      message: 'Successfully registered for Moot Court event',
      data: formatPrisma(updatedEvent)
    });
  } catch (error) {
    console.error('Error registering for moot court:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to register for moot court event',
      error: error.message
    });
  }
};

// Update registration status
exports.updateRegistrationStatus = async (req, res) => {
  try {
    const { eventId, regId } = req.params;
    const { status } = req.body;

    if (!isValidUUID(eventId) || !isValidUUID(regId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format'
      });
    }

    const eventCheck = await prisma.mootCourt.findUnique({
      where: { id: eventId }
    });

    if (!eventCheck) {
      return res.status(404).json({
        success: false,
        message: 'Moot court event not found'
      });
    }

    const registrationCheck = await prisma.mootCourtRegistration.findUnique({
      where: { id: regId }
    });

    if (!registrationCheck) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    await prisma.mootCourtRegistration.update({
      where: { id: regId },
      data: { status }
    });

    const updatedEvent = await prisma.mootCourt.findUnique({
      where: { id: eventId },
      include: {
        schedule: true,
        registrations: true
      }
    });

    res.status(200).json({
      success: true,
      message: 'Registration status updated successfully',
      data: formatPrisma(updatedEvent)
    });
  } catch (error) {
    console.error('Error updating registration status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update registration status',
      error: error.message
    });
  }
};
