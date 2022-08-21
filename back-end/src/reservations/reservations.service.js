const knex = require("../db/connection");

const table = "reservations";

function list(date) {
    return knex(table)
        .select("*")
        .where({ "reservation_date" : date})
        .orderBy("reservation_time")
}

function create(newReservation) {
    return knex(table)
        .insert(newReservation)
        .returning("*")
}

module.exports = {
    list,
    create
}