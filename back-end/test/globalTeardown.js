// test/globalTeardown.js
const knex = require("../src/db/connection");

module.exports = async () => {
	await knex.destroy(); // Only called once after all tests
};
