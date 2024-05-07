const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");

module.exports = tseslint.config({
  extends: [eslint.configs.recommended, ...tseslint.configs.recommended],
  // env: {
  //   browser: true,
  //   es2021: true,
  //   jest: true,
  // },
  // overrides: [],
  // parserOptions: {
  //   ecmaVersion: "latest",
  //   sourceType: "module",
  // },
  rules: {
    "import/no-extraneous-dependencies": "off",
    "import/no-unresolved": "off",
    "import/extensions": "off",
    "react/prop-types": "off",
    "no-console": "off",
    "object-curly-newline": "off",
    "no-plusplus": "off",
    "no-promise-executor-return": "off",
    "func-style": 2,
    quotes: "off",
    "no-alert": "off",
    camelcase: "off",
    "consistent-return": "off",
    "no-unused-expressions": ["error", { allowTernary: true }],
    "no-unused-vars": [
      "error",
      { argsIgnorePattern: "_|(knex)", destructuredArrayIgnorePattern: "^_" },
    ],
  },
  ignores: ["dist/**/*", "eslint.config.js"],
});
