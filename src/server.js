import express from "express";
import { config } from "dotenv";
import { connectDB, disconnectDB } from "./config/db.js";

import eventRoutes from "./routes/eventRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import cors from "cors";

connectDB();
config();

const app = express();

// Configure CORS
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"], // Add your frontend URLs
    credentials: true, 
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);



app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/home", eventRoutes);
app.use("/auth", authRoutes);

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get("/", (req, res) => {
  res.json({ message: "hello" });
});

//handel unhandled promise rejections (e.g. database connection errors)
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  server.close(async () => {
    await disconnectDB();
    process.exit(1);
  });
});

process.on("uncaughtException", async (err) => {
  console.error("Uncaught Exception:", err);
  server.close(async () => {
    await disconnectDB();
    process.exit(1);
  });
});

process.on("SIGTERM", async () => {
  console.log("SIGNTERM received ,shutting down gracefully");
  server.close(async () => {
    await disconnectDB();
    process.exit(0);
  });
});
