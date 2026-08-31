import { prisma } from "../config/db.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
import asyncHandler from "express-async-handler";
import { PrismaClient, UserRole } from "@prisma/client";

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await prisma.user.findUnique({
      where: { email: email },
    });

    if (userExists) {
      return res.status(400).json({ error: "User already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log("the role is:", role);

    const allowedRoles = ["ORGANIZER", "ATTENDEE", "ADMIN"];
    const parsedRole = role ? String(role).trim().toUpperCase() : null;
    const finalRole = allowedRoles.includes(parsedRole)
      ? parsedRole
      : "ATTENDEE";

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hashedPassword,
        role: finalRole, // Set the assigned role
      },
    });

    // generating jwt token
    const token = generateToken(user.id, res);
    res.status(201).json({
      status: "success",
      data: {
        user: { id: user.id, name: name, email: email, role: user.role },
        token,
      },
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email: email } });
  if (!user) {
    return res.status(400).json({ error: "Invalid email or password " });
  }
  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    return res.status(400).json({ error: "Invalid email or password" });
  }

  // generating jwt tokern

  const token = generateToken(user.id, res);

  res.status(200).json({
    status: "success",
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    },
  });
};

const logout = (req, res) => {
  res.cookie("jwt", "", { httpOnly: true, expires: new Date(0) });
  res
    .status(200)
    .json({ status: "success", message: "User logged out successfully" });
};

const getMe = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json({
    status: "success",
    data: { user },
  });
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  res
    .status(200)
    .json({ status: "success", results: users.length, data: { users } });
});

export { register, login, logout, getMe, getAllUsers };
