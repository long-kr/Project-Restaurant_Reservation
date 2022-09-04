const { table } = require("../connection");

exports.up = function(knex) {
    return knex.schema.table("tables", (table) => {
        table.integer("reservation_id").unsigned()
        table
            .foreign("reservation_id")
            .references("reservation_id")
            .inTable("reservations")
            .onDelete("CASCADE");
    })
};

exports.down = function(knex) {
    return knex.schema.table("tables", (table) => {
        table.dropColumn("reservation_id");
    })
};
