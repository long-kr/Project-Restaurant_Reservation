module.exports = {
	launch: {
		headless: (process.env.HEADLESS || "true") === "true",
		args: ["--no-sandbox", "--disable-setuid-sandbox"],
		slowMo: process.env.SLO_MO || 0,
		devtools: true,
		executablePath: "/usr/bin/chromium-browser",
	},
};
