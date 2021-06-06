const { resolve: resolvePath } = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: {
    main: { import: "./src/entrypoints/main.ts", filename: "index.js" },
    preload: { import: "./src/entrypoints/preload.ts", filename: "preload.js" },
  },
  // Put your normal webpack config below here
  module: {
    rules: require("./webpack.rules"),
  },
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx", ".css", ".json"],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: resolvePath(__dirname, "src/assets"),
          to: "assets",
        },
      ],
    }),
  ],
};
