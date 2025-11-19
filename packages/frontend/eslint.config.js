import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

import path from "path";
import { fileURLToPath } from "url";

// ESM-safe __dirname
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    // use the typescript parser and point it explicitly at this package's tsconfig(s)
    parser: "@typescript-eslint/parser",
    parserOptions: {
      tsconfigRootDir: __dirname,
      project: ["./tsconfig.json", "./tsconfig.app.json"],
    },
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs["recommended-latest"],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    // Disable type-aware parsing for common tool config files (vite/vitest, etc.)
    // so they don't trigger the multiple-candidates error and so linting remains fast.
    overrides: [
      {
        files: [
          "vite.config.*",
          "vitest.config.*",
          "*.config.*",
          "*/vite.config.*",
          "*/vitest.config.*",
        ],
        parserOptions: {
          tsconfigRootDir: __dirname,
          project: undefined, // disables type-aware rules for these files
        },
      },
    ],
  },
]);
