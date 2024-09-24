const webpack = require("webpack");
const path = require("path");

module.exports = {
  entry: "./src/visual.ts",
  mode: "production",
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.less$/,
        use: ["style-loader", "css-loader", "less-loader"],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        type: 'asseet/resource',
        generator: {
          filename: 'assets/[name][ext][query]'
        },
        loader: "url-loader",
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js"],
  },
  output: {
    filename: "visual.js",
    path: path.resolve(__dirname, "dist"),
  },
  externals: {
    "powerbi-visuals-api": "null",
  },
};