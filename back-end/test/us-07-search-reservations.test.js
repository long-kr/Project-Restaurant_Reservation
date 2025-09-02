const request = require("supertest");

const app = require("../src/app");
const knex = require("../src/db/connection");

describe("US-07 - Search reservation by phone number", () => {
	beforeAll(async () => {
		await knex.migrate.forceFreeMigrationsLock();
		await knex.migrate.rollback(undefined, true);
		await knex.migrate.latest();
	});

	beforeEach(async () => {
		await knex.seed.run();
	});

	afterAll(async () => {
		await knex.migrate.rollback(undefined, true);
		await knex.release();
	});

	describe("GET /reservations?mobile_number=...", () => {
		test("returns reservations for a partial existing phone number", async () => {
			const response = await request(app)
				.get("/reservations?mobile_number=808")
				.set("Accept", "application/json");

			expect(response.body.error).toBeUndefined();
			expect(response.body.data).toHaveLength(2);
		});

		test("returns empty list for non-existent phone number", async () => {
			const response = await request(app)
				.get("/reservations?mobile_number=518-555-0169")
				.set("Accept", "application/json");

			expect(response.body.error).toBeUndefined();
			expect(response.body.data).toHaveLength(0);
		});
	});
});
