module.exports = {
  env: {
    es2019: true,
    node: true,
  },
  extends: [
    "airbnb-base",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:prettier/recommended",
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".ts"],
        moduleDirectory: ["test/", "src/"],
      },
    },
  },
  rules: {
    "no-unused-vars": 0,
    "import/no-unresolved": 0,
    "consistent-return": 0,
    "max-classes-per-file": 0,
    "class-methods-use-this": 0,
    camelcase: 0,
    "import/extensions": [0, "ignorePackages"],
    "no-shadow": "off",
    "@typescript-eslint/no-shadow": ["error"],
  },
};
