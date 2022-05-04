const path = require("path");

module.exports = {
  output: {
    filename: "main.js",
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/preset-env",
                {
                  targets: ["last 2 versions", "ie <= 11"],
                  useBuiltIns: "usage",
                  corejs: { version: 3, proposals: true },
                },
              ],
            ],
            plugins: [["@babel/transform-runtime"]],
          },
        },
      },
    ],
  },
};
