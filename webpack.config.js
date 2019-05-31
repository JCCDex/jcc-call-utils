const DuplicatePackageCheckerPlugin = require("duplicate-package-checker-webpack-plugin");
const path = require("path");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

const config = {
    entry: "./src/index.ts",
    output: {
        filename: "call.min.js",
        path: path.resolve(__dirname, "./dist"),
        libraryTarget: "umd"
    },
    target: "node",
    resolve: {
        extensions: [".js", ".ts"],
        alias: {
            "bn.js": path.resolve(__dirname, "node_modules/bn.js"),
            "bignumber.js": path.resolve(__dirname, "node_modules/bignumber.js")
        }
    },
    mode: process.env.MODE === "dev" ? 'development' : "production",
    node: {
        fs: "empty",
        tls: "empty"
    },
    module: {
        rules: [{
            test: /\.tsx?$/,
            use: "ts-loader",
            exclude: /node_modules/
        }]
    },
    plugins: [
        new DuplicatePackageCheckerPlugin()
    ]
};

if (process.env.REPORT === "true") {
    config.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = config;