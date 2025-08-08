const environment = process.env.NODE_ENV || "development";
const config = require("../../knexfile")[environment];
const knex = require("knex");

let instance;

function getKnexInstance() {
	if (!instance) {
		instance = knex(config);
	}
	return instance;
}

module.exports = getKnexInstance();
