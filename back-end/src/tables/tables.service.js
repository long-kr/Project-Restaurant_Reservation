const knex = require("../db/connection");
const { logger } = require("../config/logger");

const tableName = "tables";

/**
 * List all tables ordered by table_name
 * @returns {Promise<Array>} Array of tables
 */
function list() {
	logger.debug("Querying all tables");

	return knex(tableName).select("*").orderBy("table_name");
}

/**
 * Read a specific table by ID
 * @param {number} tableId - Table ID
 * @returns {Promise<Object|null>} Table object or null if not found
 */
function read(tableId) {
	logger.debug(`Reading table: ${tableId}`);

	return knex(tableName).select("*").where({ table_id: tableId }).first();
}

/**
 * Create a new table
 * @param {Object} table - Table data
 * @returns {Promise<Object>} Created table
 */
function create(table) {
	logger.debug("Creating table:", table);

	return knex(tableName)
		.insert(table)
		.returning("*")
		.then((createdTables) => {
			const created = createdTables[0];
			logger.info(`Created table with ID: ${created.table_id}`);
			return created;
		});
}

/**
 * Update an existing table
 * @param {Object} updatedTable - Updated table data
 * @returns {Promise<Object>} Updated table
 */
function update(updatedTable) {
	const { table_id, ...updateData } = updatedTable;
	logger.debug(`Updating table ${table_id}:`, updateData);

	return knex(tableName)
		.where({ table_id })
		.update(updateData)
		.returning("*")
		.then((updatedTables) => {
			const updated = updatedTables[0];
			logger.info(`Updated table: ${updated.table_id}`);
			return updated;
		});
}

/**
 * Delete a table
 * @param {number} tableId - Table ID to delete
 * @returns {Promise<number>} Number of deleted rows
 */
function destroy(tableId) {
	logger.debug(`Deleting table: ${tableId}`);

	return knex(tableName)
		.where({ table_id: tableId })
		.del()
		.then((deletedCount) => {
			logger.info(`Deleted table: ${tableId}`);
			return deletedCount;
		});
}

/**
 * Find available tables for a given party size
 * @param {number} partySize - Number of people
 * @returns {Promise<Array>} Array of available tables
 */
function findAvailable(partySize) {
	logger.debug(`Finding available tables for party size: ${partySize}`);

	return knex(tableName)
		.select("*")
		.where("capacity", ">=", partySize)
		.whereNull("reservation_id")
		.orderBy("capacity")
		.orderBy("table_name");
}

/**
 * Get table occupancy statistics
 * @returns {Promise<Object>} Occupancy statistics
 */
function getOccupancyStats() {
	logger.debug("Getting table occupancy statistics");

	return knex(tableName)
		.select(
			knex.raw("COUNT(*) as total_tables"),
			knex.raw("COUNT(reservation_id) as occupied_tables"),
			knex.raw("COUNT(*) - COUNT(reservation_id) as available_tables"),
			knex.raw(
				"ROUND(COUNT(reservation_id) * 100.0 / COUNT(*), 2) as occupancy_percentage"
			)
		)
		.first();
}

module.exports = {
	list,
	read,
	create,
	update,
	destroy,
	findAvailable,
	getOccupancyStats,
};
