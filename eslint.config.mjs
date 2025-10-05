import { fileURLToPath } from "url";
import path from "path";
import globals from "globals";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import eslintPluginTs from "@eslint/js"; // Example: import recommended defaults from ESLint

export default [
    // Ignores
    {
        ignores: [
            "eslint.config.mjs",
            "**/dist/"
        ],
    },
    // Defaults
    ...eslintPluginTs.configs.recommended,
    {
        languageOptions: {
            globals: {
                ...globals.browser,
            },
            parserOptions: {
                project: "./tsconfig.json",
                tsconfigRootDir: __dirname,
            },
        },
    },
];
