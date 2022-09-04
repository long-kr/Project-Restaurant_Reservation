const knex = require("../db/connection");

const table = "tables";

function list() {
    return knex(table)
        .select("*")
        .orderBy("table_name");
};

function read(table_id) {
    return knex(table)
        .select("*")
        .where({"table_id": table_id})
        .first();
};

function create(newTable) {
    return knex(table)
        .insert(newTable)
        .returning("*")
        .then((arr) => arr[0]);
};

function update(updateTable) {
    return knex(table)
        .where({"table_id": updateTable.table_id})
        .update(updateTable, "*")
        .then((arr) => arr[0])
};

function destroy(table_id) {
    return knex(table)
        .where({"table_id": table_id})
        .update({"reservation_id": null})
};

module.exports = {
    list,
    create,
    read,
    update,
    destroy
};