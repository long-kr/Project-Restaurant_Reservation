const js = require("@eslint/js");

module.exports = [
	js.configs.recommended,
	{
		languageOptions: {
			ecmaVersion: 2022,
			sourceType: "commonjs",
			globals: {
				// Node.js globals
				global: "readonly",
				process: "readonly",
				Buffer: "readonly",
				__dirname: "readonly",
				__filename: "readonly",
				module: "readonly",
				require: "readonly",
				exports: "readonly",
				console: "readonly",
				setTimeout: "readonly",
				clearTimeout: "readonly",
				setInterval: "readonly",
				clearInterval: "readonly",
				setImmediate: "readonly",
				clearImmediate: "readonly",
			},
		},
		rules: {
			// Error Prevention
			"no-console": "off", // Allow console.log in Node.js
			"no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
			"no-undef": "error",
			"no-unreachable": "error",
			"no-duplicate-imports": "error",

			// Best Practices
			eqeqeq: ["error", "always"],
			curly: ["error", "all"],
			"no-eval": "error",
			"no-implied-eval": "error",
			"no-new-func": "error",
			"no-return-assign": "error",
			"no-sequences": "error",
			"no-throw-literal": "error",
			"prefer-const": "error",
			"no-var": "error",

			// Style (handled by Prettier, but some logical ones)
			"no-multiple-empty-lines": ["error", { max: 2, maxEOF: 1 }],
			"no-trailing-spaces": "error",
			"eol-last": "error",
		},
		ignores: [
			"node_modules/**",
			"dist/**",
			"build/**",
			"coverage/**",
			"*.min.js",
		],
	},
	{
		// Test files configuration
		files: ["test/**/*.js", "**/*.test.js", "**/*.spec.js"],
		languageOptions: {
			globals: {
				// Jest globals
				describe: "readonly",
				it: "readonly",
				test: "readonly",
				expect: "readonly",
				beforeAll: "readonly",
				afterAll: "readonly",
				beforeEach: "readonly",
				afterEach: "readonly",
				jest: "readonly",
			},
		},
		rules: {
			"no-unused-expressions": "off", // Allow expect().toBe() patterns
		},
	},
];
