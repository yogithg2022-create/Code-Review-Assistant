/* =========================================================
   server.js
   Express server entry point for Code Review Assistant
========================================================= */

const express = require("express");
const cors = require("cors");
const analyzeRoute = require("./routes/analyzeRoute");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "1mb" })); // protect from large payloads

// Routes
app.use("/api/analyze", analyzeRoute);

// Root health check
app.get("/", (req, res) => {
    res.json({ status: "Backend is running 🚀" });
});

// Global error handler (must be last)
app.use(errorHandler);

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
