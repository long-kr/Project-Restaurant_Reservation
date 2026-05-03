const { ErrorFactory } = require("./AppError");

/**
 * Express API "Not found" handler.
 */
function notFound(req, res, next) {
	next(ErrorFactory.notFound(`Path not found: ${req.originalUrl}`));
}

module.exports = notFound;
