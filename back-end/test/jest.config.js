module.exports = {
	testTimeout: 20000,
	rootDir: "../",
	setupFilesAfterEnv: ["./test/setup.jest.js"],
	globalTeardown: "./test/globalTeardown.js",
};
