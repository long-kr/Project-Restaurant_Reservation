const app = require("./app");
const config = require("./config");
const { logger } = require("./config/logger");

const { PORT = 5001 } = process.env;

// Global error handlers (should be set before starting server)
process.on("unhandledRejection", (err) => {
	logger.error("Unhandled Promise Rejection:", err);
	process.exit(1);
});

process.on("uncaughtException", (err) => {
	logger.error("Uncaught Exception:", err);
	process.exit(1);
});

const server = app.listen(PORT, () => {
	logger.info({
		message: `🚀 Server started successfully`,
		port: PORT,
		environment: config.server.env,
		timestamp: new Date().toISOString(),
	});
});

// Graceful shutdown
const gracefulShutdown = (signal) => {
	logger.info(`${signal} received. Starting graceful shutdown...`);

	server.close((err) => {
		if (err) {
			logger.error("Error during server shutdown:", err);
			process.exit(1);
		}

		logger.info("Server closed successfully");
		process.exit(0);
	});

	// Force close after 10 seconds
	setTimeout(() => {
		logger.error("Forcing server shutdown after timeout");
		process.exit(1);
	}, 10000);
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

module.exports = server;
