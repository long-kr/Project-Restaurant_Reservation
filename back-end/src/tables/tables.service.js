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
        .then(() => {
            return knex("reservations")
                .where({"reservation_id": updateTable.reservation_id})
                .update({status: "seated"}, "*")
                .then((arr) => arr[0])
        })
};

function destroy(deletedTable) {
    return knex(table)
        .where({"table_id": deletedTable.table_id})
        .update({"reservation_id": null})
        .then(() => {
            return knex("reservations")
                .where({"reservation_id": deletedTable.reservation_id})
                .update({status: "finished"}, "*")
                .then((arr) => arr[0])
        })
};

module.exports = {
    list,
    create,
    read,
    update,
    destroy
};