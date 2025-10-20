import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.node },
    rules: {
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      eqeqeq: ["error", "always"],
      "no-var": "error",
      "prefer-const": "warn",
      "prefer-arrow-callback": "warn",
      semi: ["error", "always"],
      quotes: ["error", "double"],
      "indent": ["error", 2, { "SwitchCase": 1 }],
      "comma-dangle": ["error", "always-multiline"],
      "arrow-spacing": "error",
      "no-duplicate-imports": "error",
    },
  },
]);