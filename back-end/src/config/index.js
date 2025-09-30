const path = require("path");

// Load environment variables
require("dotenv").config({ path: path.join(__dirname, "..", "..", ".env") });

const config = {
	// Server Configuration
	server: {
		port: process.env.PORT || 5001,
		host: process.env.HOST || "localhost",
		env: process.env.NODE_ENV || "development",
	},

	// Database Configuration
	database: {
		url: process.env.DATABASE_URL,
		ssl:
			process.env.NODE_ENV === "production"
				? { rejectUnauthorized: false }
				: false,
	},

	// Application Configuration
	app: {
		name: "Restaurant Reservation System",
		version: "1.0.0",
	},

	// Business Rules
	business: {
		restaurant: {
			openingTime: "10:30",
			closingTime: "21:30",
			lastSeatingTime: "20:30",
			closedDays: [2], // Tuesday = 2 (0 = Sunday, 1 = Monday, etc.)
		},
	},

	// Logging Configuration
	logging: {
		level: process.env.LOG_LEVEL || "info",
		prettyPrint: process.env.NODE_ENV !== "production",
	},

	// CORS Configuration
	cors: {
		origin: process.env.CORS_ORIGIN || "*",
		credentials: true,
	},
};

module.exports = config;
