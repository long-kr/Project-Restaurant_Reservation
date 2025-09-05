const fs = require("fs");
const { getBrowser, onPageConsole } = require("./utils");
const fsPromises = fs.promises;

const baseURL = process.env.BASE_URL || "http://localhost:3000";

describe("US-07 - Search reservations - E2E", () => {
	let page;
	let browser;

	beforeAll(async () => {
		await fsPromises.mkdir("./.screenshots", { recursive: true });
		browser = await getBrowser();
	});

	beforeEach(async () => {
		page = await browser.newPage();
		page.on("console", onPageConsole);
		await page.setViewport({ width: 1920, height: 1080 });
		await page.goto(`${baseURL}/search`, { waitUntil: "networkidle0" });
	});

	afterEach(async () => {
		await browser.close();
	});

	describe("/search page", () => {
		test("entering an existing mobile number and submitting displays the matched records", async () => {
			await page.type("input[name=mobile_number]", "808-555-0140");

			await page.screenshot({
				path: ".screenshots/us-07-search-reservations-submit-valid-before.png",
				fullPage: true,
			});

			await Promise.all([
				page.click("button[type=submit]"),
				page.waitForResponse((response) =>
					response.url().includes("mobile_number=")
				),
			]);

			await page.screenshot({
				path: ".screenshots/us-07-search-reservations-submit-valid-after.png",
				fullPage: true,
			});
			await expect(page).toMatchTextContent(/Tiger/);
		});

		test("entering an non-existent phone number and submitting displays a No reservations found message", async () => {
			await page.type("input[name=mobile_number]", "1231231232");

			await page.screenshot({
				path: ".screenshots/us-07-search-reservations-submit-no-result-before.png",
				fullPage: true,
			});

			await Promise.all([
				page.click("button[type=submit]"),
				page.waitForResponse((response) =>
					response.url().includes("mobile_number=")
				),
			]);

			await page.screenshot({
				path: ".screenshots/us-07-search-reservations-submit-no-result-after.png",
				fullPage: true,
			});
			await expect(page).toMatchTextContent(/No reservations found/);
		});
	});
});
