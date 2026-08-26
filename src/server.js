import express from "express";
import ticketer from "./routes/ticketingRoute.js";
import { config } from "dotenv";
import { connectDB, disconnectDB } from "./config/db.js";
import cors from "cors";

config();
connectDB();
const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"], // Add your frontend URLs
    credentials: true, // Crucial for passing HTTP-only JWT cookies
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
//API Route
app.use("/ticket", ticketer);

app.get("/hello", (req, res) => {
  res.json({ message: "hello world" });
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});

//GET, POST, DELETE, PUT
//http://localhost:5001/

//handel unhandled promise rejections (e.g. database connection errors)

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  server.close(async () => {
    await disconnectDB();
    process.exit(1); // Exit the process with an error code
  });
});

process.on("uncaughtException", async (err) => {
  console.error("Uncaught Exception:", err);
  server.close(async () => {
    await disconnectDB();
    process.exit(1); // Exit the process with an error code
  });
});

process.on("SIGTERM", async () => {
  console.log("SIGNTERM received ,shutting down gracefully");
  server.close(async () => {
    await disconnectDB();
    process.exit(0); // Exit the process with an error code
  });
});
