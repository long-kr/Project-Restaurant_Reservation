module.exports = {
	launch: {
		headless: (process.env.HEADLESS || "true") === "true",
		args: ["--no-sandbox", "--disable-setuid-sandbox"],
		dumpio: true,
		slowMo: process.env.SLO_MO || 0,
		devtools: true,
	},
};
