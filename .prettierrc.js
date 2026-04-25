module.exports = {
    trailingComma: "all",
    tabWidth: 4,
    semi: true,
    singleQuote: false,
    jsxSingleQuote: false,
    jsxBracketSameLine: false,
    arrowParens: "always",
    endOfLine: "lf",
    embeddedLanguageFormatting: "auto",

    tailwindStylesheet: "./src/app/globals.css",
    tailwindFunctions: ["clsx", "cn", "cva"],

    importOrder: ["<THIRD_PARTY_MODULES>", "@/(.*)$", "\\./(.*)$"],
    importOrderSeparation: true,
    importOrderSortSpecifiers: true,
    importOrderGroupNamespaceSpecifiers: true,

    plugins: [
        "@trivago/prettier-plugin-sort-imports",
        "prettier-plugin-tailwindcss",
    ],
};
