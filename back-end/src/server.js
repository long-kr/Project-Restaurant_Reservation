const app = require("./app");
const config = require("./config");
const { logger } = require("./config/logger");

const PORT = config.server.port;


const server = app.listen(PORT, () => {
	logger.info({
		message: `🚀 Server started successfully`,
		port: PORT,
		environment: config.server.env,
		timestamp: new Date().toISOString(),
	});
});

module.exports = server;
