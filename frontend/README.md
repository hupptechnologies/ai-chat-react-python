# AI Chat React Frontend

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

## Code Quality & Development Tools

This project uses several tools to maintain high code quality and consistency:

### Code Formatting
- **Prettier**: Automatically formats code according to consistent style rules
- **Configuration**: `.prettierrc` and `.prettierignore`

### Linting
- **ESLint**: Identifies and fixes code quality issues
- **TypeScript ESLint**: TypeScript-specific linting rules
- **React Hooks**: Enforces React Hooks rules
- **Configuration**: `eslint.config.js`

### Static Type Checking
- **TypeScript**: Provides static type checking and IntelliSense
- **Configuration**: `tsconfig.json` and `tsconfig.node.json`

### Pre-commit Hooks
- **Husky**: Manages Git hooks
- **lint-staged**: Runs quality checks only on staged files
- **commitlint**: Enforces conventional commit message format

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Run ESLint with auto-fix
npm run format           # Format code with Prettier
npm run format:check     # Check code formatting
npm run type-check       # Run TypeScript type checking
npm run type-check:watch # Run TypeScript type checking in watch mode

# Combined Quality Checks
npm run quality-check    # Run all quality checks (lint + format + type-check)
npm run quality-fix      # Fix all quality issues (lint:fix + format)
```

### Pre-commit Workflow

1. **Automatic Formatting**: When you commit, Prettier automatically formats your code
2. **Linting**: ESLint checks for code quality issues and fixes what it can
3. **Type Checking**: TypeScript validates type safety
4. **Commit Message Validation**: commitlint ensures conventional commit format

### Commit Message Format

This project uses [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `build`: Build system changes
- `ci`: CI/CD changes
- `chore`: Maintenance tasks
- `revert`: Reverting previous commits

**Examples:**
```bash
git commit -m "feat: add user authentication"
git commit -m "fix: resolve navigation bug in mobile view"
git commit -m "docs: update API documentation"
git commit -m "style: format code with prettier"
```

### IDE Setup

For the best development experience, install these VS Code extensions:
- **ESLint**: ESLint integration
- **Prettier**: Prettier integration
- **TypeScript**: TypeScript support

### Troubleshooting

If pre-commit hooks fail:
1. Run `npm run quality-fix` to fix all issues
2. Stage the fixed files: `git add .`
3. Try committing again

If you need to bypass hooks (not recommended):
```bash
git commit --no-verify -m "your message"
```
