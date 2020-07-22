const webpack = require("webpack");
const path = require("path");

const NodemonPlugin = require("nodemon-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const nodeExternals = require("webpack-node-externals");

module.exports = {
  entry: ["./src/index.ts"],
  devtool: "inline-source-map",
  target: "node",
  externals: [nodeExternals({})],
  module: {
    rules: [
      {
        test: /.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  mode: "development",
  optimization: {
    usedExports: true,
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  plugins: [new CleanWebpackPlugin(), new NodemonPlugin()],
  output: {
    path: path.join(__dirname, "dist"),
    filename: "index.js",
    publicPath: "/",
  },
};
