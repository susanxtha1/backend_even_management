import { prisma } from "../config/db.js";
import asyncHandler from "express-async-handler";

/**
 * @desc    Get all venues with pagination
 * @route   GET /api/venues
 * @access  Public
 */
export const getVenues = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
  const skip = (page - 1) * limit;

  const [venues, total] = await Promise.all([
    prisma.venue.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { events: true } },
      },
    }),
    prisma.venue.count(),
  ]);

  res.status(200).json({
    status: "success",
    results: venues.length,
    pagination: {
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      totalResults: total,
    },
    data: { venues },
  });
});

/**
 * @desc    Get a single venue by ID
 * @route   GET /api/venues/:id
 * @access  Public
 */
export const getVenueById = asyncHandler(async (req, res) => {
  const venue = await prisma.venue.findUnique({
    where: { id: req.params.id },
    include: {
      _count: { select: { events: true } },
      events: {
        take: 5,
        orderBy: { startTime: "desc" },
        select: {
          id: true,
          title: true,
          startTime: true,
          endTime: true,
          status: true,
        },
      },
    },
  });

  if (!venue) {
    return res.status(404).json({
      status: "fail",
      message: "Venue not found",
    });
  }

  res.status(200).json({
    status: "success",
    data: { venue },
  });
});

/**
 * @desc    Create a new venue
 * @route   POST /api/venues
 * @access  ADMIN, ORGANIZER
 */
export const createVenue = asyncHandler(async (req, res) => {
  const { name, address, capacity } = req.body;

  const venue = await prisma.venue.create({
    data: { name, address, capacity },
  });

  res.status(201).json({
    status: "success",
    data: { venue },
  });
});

/**
 * @desc    Update a venue
 * @route   PUT /api/venues/:id
 * @access  ADMIN, ORGANIZER
 */
export const updateVenue = asyncHandler(async (req, res) => {
  const existing = await prisma.venue.findUnique({
    where: { id: req.params.id },
  });

  if (!existing) {
    return res.status(404).json({
      status: "fail",
      message: "Venue not found",
    });
  }

  const venue = await prisma.venue.update({
    where: { id: req.params.id },
    data: req.body,
  });

  res.status(200).json({
    status: "success",
    data: { venue },
  });
});

/**
 * @desc    Delete a venue
 * @route   DELETE /api/venues/:id
 * @access  ADMIN
 */
export const deleteVenue = asyncHandler(async (req, res) => {
  const existing = await prisma.venue.findUnique({
    where: { id: req.params.id },
    include: { _count: { select: { events: true } } },
  });

  if (!existing) {
    return res.status(404).json({
      status: "fail",
      message: "Venue not found",
    });
  }

  if (existing._count.events > 0) {
    return res.status(409).json({
      status: "fail",
      message: `Cannot delete venue with ${existing._count.events} associated event(s). Remove or reassign events first.`,
    });
  }

  await prisma.venue.delete({ where: { id: req.params.id } });

  res.status(200).json({
    status: "success",
    message: "Venue deleted successfully",
  });
});
