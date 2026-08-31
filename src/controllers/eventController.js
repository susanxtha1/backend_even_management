import { prisma } from "../config/db.js";
import asyncHandler from "express-async-handler";

/**
 * @desc    Get all events with pagination and optional filters
 * @route   GET /api/events
 * @access  Public
 */
export const getEvents = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
  const skip = (page - 1) * limit;

  // Build dynamic filter
  const where = {};

  if (req.query.status) {
    where.status = req.query.status;
  }

  if (req.query.venueId) {
    where.venueId = req.query.venueId;
  }

  // Optional: filter for upcoming events only
  if (req.query.upcoming === "true") {
    where.startTime = { gt: new Date() };
  }

  const [events, total] = await Promise.all([
    prisma.event.findMany({
      where,
      skip,
      take: limit,
      orderBy: { startTime: "desc" },
      include: {
        venue: {
          select: { id: true, name: true, address: true },
        },
        organizer: {
          select: { id: true, name: true, email: true },
        },
        _count: { select: { tickets: true } },
      },
    }),
    prisma.event.count({ where }),
  ]);

  res.status(200).json({
    status: "success",
    results: events.length,
    pagination: {
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      totalResults: total,
    },
    data: { events },
  });
});

/**
 * @desc    Get a single event by ID
 * @route   GET /api/events/:id
 * @access  Public
 */
export const getEventById = asyncHandler(async (req, res) => {
  const event = await prisma.event.findUnique({
    where: { id: req.params.id },
    include: {
      venue: {
        select: { id: true, name: true, address: true, capacity: true },
      },
      organizer: {
        select: { id: true, name: true, email: true },
      },
      tickets: {
        select: {
          id: true,
          name: true,
          price: true,
          totalQuantity: true,
          availableQuantity: true,
        },
      },
    },
  });

  if (!event) {
    return res.status(404).json({
      status: "fail",
      message: "Event not found",
    });
  }

  res.status(200).json({
    status: "success",
    data: { event },
  });
});

/**
 * @desc    Create a new event
 * @route   POST /api/events
 * @access  ORGANIZER, ADMIN
 */
export const createEvent = asyncHandler(async (req, res) => {
  const { venueId, title, description, startTime, endTime, status } = req.body;

  // Verify the venue exists
  const venue = await prisma.venue.findUnique({ where: { id: venueId } });
  if (!venue) {
    return res.status(400).json({
      status: "fail",
      message: "The specified venue does not exist",
    });
  }

  const event = await prisma.event.create({
    data: {
      organizerId: req.user.id,
      venueId,
      title,
      description: description || null,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      status,
    },
    include: {
      venue: {
        select: { id: true, name: true, address: true },
      },
      organizer: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  res.status(201).json({
    status: "success",
    data: { event },
  });
});

/**
 * @desc    Update an event
 * @route   PUT /api/events/:id
 * @access  Owner (organizer) or ADMIN
 */
export const updateEvent = asyncHandler(async (req, res) => {
  const existing = await prisma.event.findUnique({
    where: { id: req.params.id },
  });

  if (!existing) {
    return res.status(404).json({
      status: "fail",
      message: "Event not found",
    });
  }

  // Only the organizer who created it or an admin can update
  if (existing.organizerId !== req.user.id && req.user.role !== "ADMIN") {
    return res.status(403).json({
      status: "fail",
      message: "You can only update your own events",
    });
  }

  // If venueId is being changed, verify the new venue exists
  if (req.body.venueId) {
    const venue = await prisma.venue.findUnique({
      where: { id: req.body.venueId },
    });
    if (!venue) {
      return res.status(400).json({
        status: "fail",
        message: "The specified venue does not exist",
      });
    }
  }

  // Build update data, converting date strings to Date objects
  const updateData = { ...req.body };
  if (updateData.startTime) {
    updateData.startTime = new Date(updateData.startTime);
  }
  if (updateData.endTime) {
    updateData.endTime = new Date(updateData.endTime);
  }

  const event = await prisma.event.update({
    where: { id: req.params.id },
    data: updateData,
    include: {
      venue: {
        select: { id: true, name: true, address: true },
      },
      organizer: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  res.status(200).json({
    status: "success",
    data: { event },
  });
});

/**
 1.@desc    Delete an event
  2.@route   DELETE /api/events/:id
 3.@access  Owner (organizer) or ADMIN
 */
export const deleteEvent = asyncHandler(async (req, res) => {
  const existing = await prisma.event.findUnique({
    where: { id: req.params.id },
  });

  if (!existing) {
    return res.status(404).json({
      status: "fail",
      message: "Event not found",
    });
  }

  // Only the organizer who created it or an admin can delete
  if (existing.organizerId !== req.user.id && req.user.role !== "ADMIN") {
    return res.status(403).json({
      status: "fail",
      message: "You can only delete your own events",
    });
  }

  await prisma.event.delete({ where: { id: req.params.id } });

  res.status(200).json({
    status: "success",
    message: "Event deleted successfully",
  });
});
