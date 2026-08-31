import jwt from "jsonwebtoken";
import { prisma } from "../config/db.js";

/**
 * Protect routes — verifies JWT from Authorization header or cookie
 * and attaches the authenticated user to req.user.
 */
export const protect = async (req, res, next) => {
  let token;

  // Check Authorization header first, then fall back to cookie
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies?.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return res.status(401).json({
      status: "fail",
      message: "Not authenticated. Please log in.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, name: true, email: true, role: true },
    });

    if (!user) {
      return res.status(401).json({
        status: "fail",
        message: "User belonging to this token no longer exists.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      status: "fail",
      message: "Invalid or expired token.",
    });
  }
};

/**
 * Authorize by role — restricts access to users with the specified roles.
 * Must be used after the protect middleware.
 * @param  {...string} roles - Allowed roles (e.g. "ADMIN", "ORGANIZER")
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        status: "fail",
        message: "You do not have permission to perform this action.",
      });
    }
    next();
  };
};
