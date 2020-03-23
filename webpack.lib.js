const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  mode: 'production',
  devtool: 'none',
  entry: './src/promise.ts',
  output: {
    filename: 'promise.js',
    path: path.resolve(__dirname, 'lib'),
    libraryTarget: 'commonjs2'
  },
  resolve: {
    extensions: ['.js', '.ts']
  },
  module: {
    rules: [
      {
        test: /\.[jt]s$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000
  },
  plugins: [new CleanWebpackPlugin()]
}
