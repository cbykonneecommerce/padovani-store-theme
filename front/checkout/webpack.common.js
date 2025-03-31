const webpack = require("webpack");
const path = require("path");

module.exports = {
    entry: {
        checkout: "./src/arquivos/js/checkout.js",
    },
    output: {
        path: path.resolve(__dirname, "./checkout-ui-custom"),
        filename: "checkout6-custom.js",
    },
    resolve: {
        alias: {
            Helpers: path.resolve(__dirname, "src/arquivos/js/helpers"),
            Lib: path.resolve(__dirname, "src/arquivos/js/lib"),
            Config: path.resolve(__dirname, "src/arquivos/js/config"),
            App: path.resolve(__dirname, "src/arquivos/js/app"),
        },
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
        }),
    ],
};
