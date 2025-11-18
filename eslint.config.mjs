import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // =========================================================================
      // CODE QUALITY RULES - INDUSTRY BEST PRACTICES
      // =========================================================================

      // Prevent console statements in production code
      // Allow console.error and console.warn for production logging
      "no-console": ["warn", { allow: ["warn", "error"] }],

      // TypeScript specific rules for better type safety
      "@typescript-eslint/no-explicit-any": "warn",  // Discourage 'any' types
      "@typescript-eslint/no-unused-vars": ["warn", {
        argsIgnorePattern: "^_",  // Allow unused vars starting with _
        varsIgnorePattern: "^_",
        ignoreRestSiblings: true,  // Allow unused rest siblings in destructuring
      }],
      "@typescript-eslint/explicit-function-return-type": "off",  // Too strict for React
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-non-null-assertion": "warn",  // Warn about ! operator
      "@typescript-eslint/prefer-nullish-coalescing": "warn",  // Use ?? instead of ||
      "@typescript-eslint/prefer-optional-chain": "warn",  // Use ?. instead of && chains

      // React best practices
      "react/prop-types": "off",  // Not needed with TypeScript
      "react/react-in-jsx-scope": "off",  // Not needed in Next.js
      "react/display-name": "off",  // Allow anonymous components
      "react-hooks/rules-of-hooks": "error",  // Enforce hook rules
      "react-hooks/exhaustive-deps": "warn",  // Check hook dependencies

      // General best practices
      "no-debugger": "error",  // No debugger statements in production
      "no-alert": "warn",  // Avoid using alert()
      "no-var": "error",  // Use let/const instead of var
      "prefer-const": "warn",  // Use const when variable is not reassigned
      "prefer-template": "warn",  // Use template strings instead of concatenation
      "object-shorthand": "warn",  // Use { foo } instead of { foo: foo }
      "no-duplicate-imports": "error",  // Prevent duplicate imports

      // Code style and readability
      "curly": ["warn", "all"],  // Always use curly braces for control structures
      "eqeqeq": ["error", "always", { null: "ignore" }],  // Use === instead of ==
      "no-nested-ternary": "warn",  // Avoid nested ternary operators
      "no-return-await": "error",  // Unnecessary return await
      "require-await": "warn",  // Async functions should have await

      // Security best practices
      "no-eval": "error",  // Never use eval()
      "no-implied-eval": "error",  // No setTimeout(string)
      "no-new-func": "error",  // No new Function(string)

      // Accessibility (a11y) rules
      "jsx-a11y/alt-text": "warn",  // Images must have alt text
      "jsx-a11y/anchor-is-valid": "warn",  // Links must be valid
      "jsx-a11y/click-events-have-key-events": "warn",  // Click handlers need keyboard events
      "jsx-a11y/no-static-element-interactions": "warn",  // Interactive elements should be semantic

      // Next.js specific rules
      "@next/next/no-html-link-for-pages": "error",  // Use Link component for internal navigation
      "@next/next/no-img-element": "warn",  // Use next/image instead of <img>
    },
  },
  {
    // Configuration for test files
    files: ["**/__tests__/**/*", "**/*.test.*", "**/*.spec.*"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",  // Allow any in tests
      "no-console": "off",  // Allow console in tests
    },
  },
];

export default eslintConfig;
