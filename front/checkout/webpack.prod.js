const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = merge(common, {
    externals: {
        jquery: "jQuery",
        vtexjs: "vtexjs",
        React: "react",
    },
    mode: "production",
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [["@babel/preset-env"], "@babel/preset-react"],
                        plugins: ["@babel/plugin-transform-async-to-generator"],
                        cacheDirectory: true,
                    },
                },
            },
        ],
    },
    optimization: {
        usedExports: true,
        minimize: true,
        minimizer: [
            new TerserPlugin({
                extractComments: true,
                terserOptions: {
                    keep_classnames: true,
                    keep_fnames: true,
                    compress: {
                        pure_funcs: [
                            "console.table",
                            "console.debug",
                            "console.log",
                        ],
                    },
                },
            }),
        ],
    },
});
