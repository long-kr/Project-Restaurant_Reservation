/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */

const router = require("express").Router({ mergeParams: true });
const controller = require("./reservations.controller");

router.route("/")
    .get(controller.list)
    .post(controller.create);

module.exports = router;
