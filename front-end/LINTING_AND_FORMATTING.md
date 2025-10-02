# Linting and Formatting Setup

This project uses **ESLint** for code linting and **Prettier** for code formatting to ensure consistent code style and quality across the codebase.

## Tools Used

- **ESLint**: JavaScript/JSX linter with React-specific rules
- **Prettier**: Code formatter for consistent styling
- **eslint-plugin-prettier**: Integrates Prettier with ESLint
- **eslint-config-prettier**: Disables ESLint rules that conflict with Prettier

## Configuration Files

- `.eslintrc.js` - ESLint configuration
- `.eslintignore` - Files/directories to ignore for linting
- `.prettierrc` - Prettier configuration
- `.prettierignore` - Files/directories to ignore for formatting
- `.vscode/settings.json` - VS Code settings for auto-formatting

## Available Scripts

### Linting

```bash
# Check for linting errors
npm run lint

# Fix auto-fixable linting errors
npm run lint:fix
```

### Formatting

```bash
# Format all files
npm run format

# Check if files are properly formatted
npm run format:check

# Format and fix linting issues in one command
npm run format:lint
```

## VS Code Integration

If you're using VS Code, the project includes settings that will:

- Automatically format files on save
- Fix ESLint issues on save
- Use Prettier as the default formatter
- Ensure consistent line endings and indentation

Make sure you have the following VS Code extensions installed:

- **Prettier - Code formatter** (esbenp.prettier-vscode)
- **ESLint** (dbaeumer.vscode-eslint)

## Code Style Rules

### Prettier Configuration

- **Semicolons**: Always use semicolons
- **Quotes**: Single quotes for strings
- **Line Width**: 80 characters
- **Indentation**: 2 spaces (no tabs)
- **Trailing Commas**: ES5 compatible
- **Arrow Functions**: Avoid parentheses when possible

### ESLint Rules

- **React**: Uses react-app and react-app/jest configurations
- **Best Practices**: Enforces modern JavaScript patterns
- **Prettier Integration**: All formatting rules handled by Prettier
- **Console Warnings**: Warns about console statements (useful for debugging)

## Pre-commit Setup (Recommended)

To ensure code quality, consider setting up a pre-commit hook:

1. Install husky and lint-staged:

```bash
npm install --save-dev husky lint-staged
```

2. Add to package.json:

```json
{
  "lint-staged": {
    "src/**/*.{js,jsx}": ["eslint --fix", "prettier --write", "git add"]
  },
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  }
}
```

## Troubleshooting

### Common Issues

1. **Formatting conflicts**: If you see formatting conflicts, run `npm run format:lint`
2. **ESLint errors**: Most auto-fixable errors can be resolved with `npm run lint:fix`
3. **VS Code not formatting**: Ensure you have the Prettier and ESLint extensions installed

### Ignoring Files

- Add files to `.eslintignore` to exclude them from linting
- Add files to `.prettierignore` to exclude them from formatting

## Current Status

✅ All files are properly formatted  
✅ All linting errors have been fixed  
⚠️ Console warnings remain (expected for debugging)

The remaining warnings are for `console.log` statements, which are acceptable for debugging purposes in development.

