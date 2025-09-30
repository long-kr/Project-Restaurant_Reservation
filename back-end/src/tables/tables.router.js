/**
 * Defines the router for table resources.
 *
 * @type {Router}
 */
const router = require("express").Router({ mergeParams: true });
const controller = require("./tables.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

router
	.route("/:table_id([0-9]+)/seat")
	.put(controller.update)
	.delete(controller.finish)
	.all(methodNotAllowed);

router
	.route("/:table_id([0-9]+)")
	.get(controller.read)
	.delete(controller.destroy);

router
	.route("/")
	.get(controller.list)
	.post(controller.create)
	.all(methodNotAllowed);

module.exports = router;
