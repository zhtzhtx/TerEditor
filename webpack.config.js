const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  output: {
    filename: "[name]",
    path: path.resolve(__dirname, "./dist"),
  },
  entry: {
    'index.js': "./index.js"
  },
  devtool: "eval-source-map",
  resolve: {
    extensions: [".js", ".css"],
  },
  module: {
    rules: [
      {
        test: /\.less$/,
        include: [path.resolve(__dirname, "src")],
        use: ["style-loader", "css-loader", "less-loader"],
      },
      {
        test: /\.js$/,
        exclude: "/node_modules/",
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/env",
                {
                  targets: {
                    browsers: [
                      "last 2 Chrome major versions",
                      "last 2 Firefox major versions",
                      "last 2 Safari major versions",
                      "last 2 Edge major versions",
                      "last 2 iOS major versions",
                      "last 2 ChromeAndroid major versions",
                    ],
                  },
                },
              ],
            ],
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      chunks: ["index.js"],
      filename: "./index.html",
      template: "./public/index.html",
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, "."),
    },
    port: 3020,
    host: "localhost",
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        pathRewrite: { "^/api": "" },
      },
    },
  },
};
