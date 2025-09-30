const request = require("supertest");
const app = require("../src/app");
const knex = require("../src/db/connection");
const moment = require("moment");

// Test fixtures
const makeValidReservation = (overrides = {}) => {
  // Calculate a valid future date (not Tuesday)
  const futureDate = moment().add(1, "days");
  while (futureDate.day() === 2) { // If it's Tuesday, add another day
    futureDate.add(1, "days");
  }

  return {
    first_name: "first",
    last_name: "last",
    mobile_number: "800-555-1212",
    reservation_date: futureDate.format("YYYY-MM-DD"),
    reservation_time: "13:30",
    people: 1,
    ...overrides,
  };
};

describe("US-01 - Create and list reservations", () => {
  // Database setup and teardown
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
    await knex.destroy();
  });

  // Helper function for making POST requests
  const makeReservationRequest = (data) =>
    request(app)
      .post("/reservations")
      .set("Accept", "application/json")
      .send({ data });

  describe("App error handling", () => {
    test("returns 404 for non-existent route", async () => {
      const response = await request(app)
        .get("/nonexistent")
        .set("Accept", "application/json");

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Path not found: /nonexistent");
    });
  });

  describe("GET /reservations/:reservation_id", () => {
    test("returns 404 for non-existent reservation", async () => {
      const response = await request(app)
        .get("/reservations/99999")
        .set("Accept", "application/json");

      expect(response.status).toBe(404);
      expect(response.body.error).toContain("99999");
    });
  });

  describe("POST /reservations", () => {
    describe("Field validation", () => {
      test.each([
        ["missing data object", { datum: {} }],
        ["empty data object", { data: {} }],
      ])("returns 400 when %s", async (_, invalidData) => {
        const response = await request(app)
          .post("/reservations")
          .set("Accept", "application/json")
          .send(invalidData);

        expect(response.status).toBe(400);
        expect(response.body.error).toBeDefined();
      });

      describe.each([
        ["first_name", ""],
        ["last_name", ""],
        ["mobile_number", ""],
        ["reservation_date", ""],
        ["reservation_time", ""],
      ])("validates %s field", (field, invalidValue) => {
        test(`returns 400 if ${field} is missing`, async () => {
          const data = makeValidReservation();
          delete data[field];

          const response = await makeReservationRequest(data);

          expect(response.status).toBe(400);
          expect(response.body.error).toContain(field);
        });

        test(`returns 400 if ${field} is empty`, async () => {
          const data = makeValidReservation({ [field]: invalidValue });

          const response = await makeReservationRequest(data);

          expect(response.status).toBe(400);
          expect(response.body.error).toContain(field);
        });
      });

      describe("validates people field", () => {
        test.each([
          ["missing", undefined],
          ["zero", 0],
          ["string", "2"],
          ["negative", -1],
        ])("returns 400 if people is %s", async (_, invalidValue) => {
          const data = makeValidReservation();
          if (invalidValue === undefined) {
            delete data.people;
          } else {
            data.people = invalidValue;
          }

          const response = await makeReservationRequest(data);

          expect(response.status).toBe(400);
          expect(response.body.error).toContain("people");
        });
      });

      describe("validates date and time formats", () => {
        test.each([
          ["reservation_date", "not-a-date"],
          ["reservation_time", "not-a-time"],
        ])("returns 400 if %s is invalid", async (field, invalidValue) => {
          const data = makeValidReservation({ [field]: invalidValue });

          const response = await makeReservationRequest(data);

          expect(response.status).toBe(400);
          expect(response.body.error).toContain(field);
        });
      });
    });

    describe("Business rules", () => {
      test("creates a new reservation when data is valid", async () => {
        const data = makeValidReservation({
          reservation_time: "17:30",
          people: 2,
        });

        const response = await makeReservationRequest(data);

        expect(response.status).toBe(201);
        expect(response.body.error).toBeUndefined();
        expect(response.body.data).toEqual(
          expect.objectContaining({
            first_name: data.first_name,
            last_name: data.last_name,
            mobile_number: data.mobile_number,
            reservation_date: expect.stringContaining(data.reservation_date),
            reservation_time: expect.stringContaining(data.reservation_time),
            people: data.people,
          })
        );
      });
    });
  });

  describe("GET /reservations", () => {
    test("returns reservations for a specific date", async () => {
      const response = await request(app)
        .get("/reservations?date=2020-12-31")
        .set("Accept", "application/json");

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].first_name).toBe("Rick");
    });

    test("returns reservations sorted by time", async () => {
      const response = await request(app)
        .get("/reservations?date=2020-12-30")
        .set("Accept", "application/json");

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data[0].first_name).toBe("Bird");
      expect(response.body.data[1].first_name).toBe("Frank");
    });
  });
});