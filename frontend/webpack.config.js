const path = require("path");

module.exports = {
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
    alias: {
      "@components": path.resolve(__dirname, "components/"),
      "@pages": path.resolve(__dirname, "pages/"),
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/i,  // תמיכה בקובצי CSS
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,  // תמיכה בפונטים
        type: "asset/resource",
      },
    ],
  },
};
