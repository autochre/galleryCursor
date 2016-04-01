var debug = process.env.NODE_ENV !== "production";
var webpack = require('webpack');
var path = require('path');
var nodeModulesPath = path.resolve(__dirname, 'node_modules');
var examplePath = path.resolve(__dirname, 'example');

module.exports = [
  {
    context: __dirname,
    devtool: debug ? "inline-sourcemap" : null,
    entry: "./src/galleryCursor.js",
    output: {
        path: __dirname + "/dist",
        filename: "./galleryCursor.min.js",
        library: "galleryCursor",
        libraryTarget: "var",
        externals: {
          baconjs: "baconjs",
          jquery: "jquery"
        }
    },
    module: {
          loaders: [
            { test: /\.js$/, exclude: [examplePath, nodeModulesPath], loader: "babel-loader"}
          ]
        }
  },
];
