const DuplicatePackageCheckerPlugin = require("duplicate-package-checker-webpack-plugin");
const path = require("path");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const webpack = require("webpack");
const config = {
  entry: "./lib/index.js",
  output: {
    filename: "jcc-call-utils.min.js",
    path: path.resolve(__dirname, "./dist"),
    library: "jcc_call_utils",
    libraryTarget: "umd"
  },
  target: "web",
  resolve: {
    extensions: [".js", ".ts"],
    alias: {
      "bn.js": path.resolve(__dirname, "node_modules/bn.js"),
      "elliptic": path.resolve(__dirname, "node_modules/elliptic"),
      "call-keypairs": path.resolve(__dirname, "node_modules/call-keypairs")
    }
  },
  mode: process.env.MODE === "dev" ? 'development' : "production",
  node: {
    fs: "empty",
    tls: "empty",
    "child_process": "empty",
    net: "empty"
  },
  module: {
    rules: [{
        test: require.resolve(path.resolve(__dirname, "lib/index.js")),
        use: 'imports-loader?this=>window'
      },
      {
        test: require.resolve(path.resolve(__dirname, "node_modules/call-for-browser")),
        use: 'exports-loader?call'
      }
    ]
  },
  externals: {
    "call-lib": true
  },
  plugins: [
    new DuplicatePackageCheckerPlugin({
      strict: false
    }),
    new webpack.ProvidePlugin({
      _: 'lodash'
    })
  ]
};

if (process.env.REPORT === "true") {
  config.plugins.push(new BundleAnalyzerPlugin())
}

if (process.env.MODE !== "dev") {
  config.plugins.push(new UglifyJsPlugin({
    uglifyOptions: {
      compress: {
        sequences: true,
        dead_code: true,
        drop_console: true,
        drop_debugger: true,
        unused: true
      }
    },
    sourceMap: false,
    parallel: true
  }))
}

module.exports = config;