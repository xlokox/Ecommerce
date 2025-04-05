const path = require('path');

module.exports = {
  // Other webpack configuration...
  devServer: {
    historyApiFallback: true,
    contentBase: path.join(__dirname, 'public'),
    compress: true,
    port: 3001
  }
};
