/**
 * Healths router.
 *
 * @type {Router}
 */
const router = require("express").Router();

const { Router } = require("express");
const methodNotAllowed = require("../errors/methodNotAllowed");
const config = require("../config");

router
	.route("/")
	.get((_, res) => {
		res.status(200).json({
			name: config.app.name,
			status: "OK",
			timestamp: new Date().toISOString(),
			uptime: process.uptime(),
			environment: config.server.env,
			version: config.app.version,
		});
	})
	.all(methodNotAllowed);

module.exports = router;

