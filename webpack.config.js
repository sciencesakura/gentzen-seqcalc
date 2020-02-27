const path = require('path');

module.exports = {
  entry: './src/ts/presentation/web.ts',
  output: {
    path: path.join(__dirname, 'docs/js'),
    filename: 'app.js'
  },
  resolve: {
    extensions: ['.ts']
  },
  module: {
    rules: [
      {test: /\.ts$/, loader: 'ts-loader'}
    ]
  }
};
