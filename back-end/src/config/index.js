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
		credentials: false,
	},

	// Rate Limiting Configuration
	rateLimit: {
		windowMs:process.env.RATE_LIMIT_WINDOW_MS ? parseInt(process.env.RATE_LIMIT_WINDOW_MS) :  (1 * 60 * 1000), 
		max: process.env.RATE_LIMIT_MAX_REQUESTS ?  parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) :  60 ,
		message: "Too many requests from this IP, please try again later.",
		standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
		legacyHeaders: false, // Disable the `X-RateLimit-*` headers
	},
};

module.exports = config;
