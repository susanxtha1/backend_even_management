import express from "express";
import { config } from "dotenv";
import {connectDb, disconnectDb} from "./config/db.js";

import eventRoutes from "./routes/eventRoutes.js";

config();


const app = express();

app.use("/home", eventRoutes);

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
