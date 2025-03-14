import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const eslintConfig = [
    ...compat.extends(
        "next/core-web-vitals",
        "next/typescript",
        "plugin:prettier/recommended",
    ),
    {
        rules: {
            "no-unused-vars": "off",
            "comma-dangle": ["error", "always-multiline"],
            "no-empty": [
                "error",
                {
                    allowEmptyCatch: true,
                },
            ],
            "@typescript-eslint/explicit-module-boundary-types": "off",
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    args: "after-used",
                    argsIgnorePattern: "^_",
                    caughtErrors: "all",
                    caughtErrorsIgnorePattern: "^_",
                    destructuredArrayIgnorePattern: "^_",
                    vars: "all",
                    varsIgnorePattern: "^_",
                    ignoreRestSiblings: false,
                },
            ],
            "@typescript-eslint/no-var-requires": "warn",
            "react/display-name": "off",
            "react/no-children-prop": "off",
        },
    },
];

export default eslintConfig;
