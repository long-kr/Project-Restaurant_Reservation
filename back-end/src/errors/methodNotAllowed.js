const { ErrorFactory } = require("./AppError");

function methodNotAllowed(req, res, next) {
	next(
		ErrorFactory.methodNotAllowed(
			`${req.method} not allowed for ${req.originalUrl}`
		)
	);
}

module.exports = methodNotAllowed;
