const knex = require("../db/connection");
const table = "reservations";

function list(date) {
    return knex(table)
        .select("*")
        .where({"reservation_date" : date})
        .whereNot({"status": "finished"})
        .whereNot({"status": "cancelled"})
        .orderBy("reservation_time")
};

function search(mobile_number) {
    return knex(table)
        .select("*")
        .whereRaw(
            "translate(mobile_number, '() -', '') like ?",
            `%${mobile_number.replace(/\D/g, "")}%`
        )
        .orderBy("reservation_date");
};

function read(reservation_id) {
    return knex(table)
        .select("*")
        .where({ "reservation_id": reservation_id})
        .first()
};

function create(newReservation) {
    return knex(table)
        .insert(newReservation)
        .returning("*")
        .then((arr) => arr[0])
};

function update(updateReservation) {
    return knex(table)
        .where({"reservation_id": updateReservation.reservation_id})
        .update(updateReservation, "*")
        .then((arr) => arr[0])
};

module.exports = {
    list,
    search,
    create,
    read,
    update,
};