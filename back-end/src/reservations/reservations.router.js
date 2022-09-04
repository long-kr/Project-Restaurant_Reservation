/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */

const router = require("express").Router({ mergeParams: true });
const controller = require("./reservations.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

router.route("/:reservation_id([0-9]+)/status")
    .put(controller.update)
    .all(methodNotAllowed)

router.route("/:reservation_id([0-9]+)")
    .get(controller.read)
    .all(methodNotAllowed)

router.route("/")
    .get(controller.list)
    .post(controller.create)
    .all(methodNotAllowed)

module.exports = router;
