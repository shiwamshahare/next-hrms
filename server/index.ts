import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import masterRoutes from "./routes/masterRoutes";
import { initDatabase } from "./db/init";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001", "*"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "online",
    service: "HRMS Node.js & Express Backend",
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use("/api/auth", authRoutes);
app.use("/api/masters", masterRoutes);

// Global Error Handler
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Unhandled Error:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  }
);

// Start Server and initialize PostgreSQL DB
async function startServer() {
  try {
    // Initialize PostgreSQL tables and seed data
    await initDatabase();

    app.listen(PORT, () => {
      console.log(`=============================================`);
      console.log(`⚡ HRMS Express Server running on port ${PORT}`);
      console.log(`🔗 Health Check: http://localhost:${PORT}/api/health`);
      console.log(`🔑 Auth Endpoint: http://localhost:${PORT}/api/auth/login`);
      console.log(`=============================================`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

startServer();

export default app;
