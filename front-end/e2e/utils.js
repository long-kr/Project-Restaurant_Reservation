const { default: puppeteer } = require("puppeteer");

async function selectOptionByText(page, name, optionText) {
	const optionWaned = await page.waitForSelector(
		`::-p-xpath(//*[@name="${name}"]/option[text()="${optionText}"])`
	);

	const optionValue = await (
		await optionWaned.getProperty("value")
	).jsonValue();

	return await page.select(`[name=${name}`, optionValue);
}

function containsText(page, selector, expected) {
	return page.evaluate(
		(selector, expected) => {
			return document
				.querySelector(selector)
				.innerText.toLowerCase()
				.includes(expected);
		},
		selector,
		expected
	);
}

/**
 * Find a button by visible text (case-insensitive).
 * @param {import('puppeteer').Page} page - Puppeteer Page instance
 * @param {string} text - Button text to match
 * @param {object} options - Options to pass to page.waitForSelector
 * @returns {Promise<import('puppeteer').ElementHandle | null>}
 */
async function findButtonByText(page, text, options = {}) {
	// Escape text safely for XPath
	const normalizedText = text.toLowerCase();

	// translate() is used to perform a case-insensitive match
	// The ::-p-xpath pseudo-element is a Puppeteer-specific extension
	const xpath = `::-p-xpath(//button\
	[contains\
	(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '${normalizedText}')\
	])`;

	return await page.waitForSelector(xpath, options);
}

/**
 * Get a Puppeteer Browser instance.
 * @param {object} options - Options to pass to puppeteer.launch
 * @return {Promise<import('puppeteer').Browser>}
 */
async function getBrowser(options = {}) {
	return await puppeteer.launch({
		executablePath: process.env.PUPPETEER_EXEC_PATH, // set by docker container
		headless: true,
		args: [`--no-sandbox`, `--disable-setuid-sandbox`],
		slowMo: 50,
		...options,
	});
}

/**
 * Log page console messages to Node console.
 */
const onPageConsole = (msg) => {
	if (msg.type() === "error") {
		return Promise.all(msg.args().map((event) => event.jsonValue())).then(
			(eventJson) =>
				console.log(`<LOG::page console ${msg.type()}>`, ...eventJson)
		);
	}
};

module.exports = {
	containsText,
	selectOptionByText,
	findButtonByText,
	getBrowser,
	onPageConsole,
};
