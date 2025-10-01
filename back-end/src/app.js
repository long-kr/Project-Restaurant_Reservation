const express = require("express");

const reservationsRouter = require("./reservations/reservations.router");
const tablesRouter = require("./tables/tables.router");

const cors = require("cors");
const { httpLogger } = require("./config/logger");
const errorHandler = require("./errors/errorHandler");
const notFound = require("./errors/notFound");
const config = require("./config");

const app = express();

// Security and parsing middleware
app.use(cors(config.cors));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use(httpLogger);

// Health check endpoint
app.get("/health", (req, res) => {
	res.status(200).json({
		name: config.app.name,
		status: "OK",
		timestamp: new Date().toISOString(),
		uptime: process.uptime(),
		environment: config.server.env,
		version: config.app.version,
	});
});

app.use("/reservations", reservationsRouter);
app.use("/tables", tablesRouter);

// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

module.exports = app;
