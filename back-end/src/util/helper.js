function hasProperties(propertyNames) {
	return (req, _, next) => {
		const { data = {} } = req.body;
		const errorMessages = [];

		for (let propertyName of propertyNames) {
			if (!(propertyName in data)) {
				errorMessages.push(propertyName);
			}
		}

		if (errorMessages.length) {
			return next({
				status: 400,
				message: `Missing required property: ${errorMessages.join(", ")}`,
			});
		}

		next();
	};
}

function isValid(validator) {
	return (req, _, next) => {
		const { data = {} } = req.body;
		const error = validator(data);

		if (error) {
			return next({
				status: 400,
				message: error,
			});
		}
		next();
	};
}

module.exports = {
	hasProperties,
	isValid,
};
