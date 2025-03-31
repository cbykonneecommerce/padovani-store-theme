module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es6: false,
        jquery: true,
    },
    globals: {
        Modulo: true,
    },
    extends: ["eslint:recommended", "plugin:prettier/recommended"],
    plugins: ["prettier"],
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
    },
    rules: {
        "prettier/prettier": "error",
        "linebreak-style": ["warn", "unix"],
        "no-undef": "off",
        "no-unused-vars": "off",
        "dot-notation": "off",
    },
};
