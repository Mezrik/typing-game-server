const webpack = require("webpack");
const path = require("path");

const NodemonPlugin = require("nodemon-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const nodeExternals = require("webpack-node-externals");
const { merge } = require("webpack-merge");

const commonConfig = {
  entry: ["./src/index.ts"],
  devtool: "inline-source-map",
  target: "node",
  externals: [nodeExternals({})],
  module: {
    rules: [
      {
        test: /.ts?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  optimization: {
    usedExports: true,
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  plugins: [new CleanWebpackPlugin()],
  output: {
    path: path.join(__dirname, "dist"),
    filename: "index.js",
    publicPath: "/",
  },
};

const productionConfig = {
  mode: "production",
};

const developmentConfig = {
  mode: "development",
  plugins: [new NodemonPlugin()],
};

module.exports = (env) => {
  switch (env.mode) {
    case "development":
      return merge(commonConfig, developmentConfig);
    case "production":
      return merge(commonConfig, productionConfig);
    default:
      throw new Error("No matching configuration was found!");
  }
};
