const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: path.join(__dirname, 'src/index.jsx'),
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dev'),
    publicPath: '/',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(jpe?g|png|gif|woff2?|eot|ttf|otf|svg)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 15000,
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'], // Ensure Webpack resolves .js and .jsx extensions
    modules: [path.join(__dirname, 'src'), 'node_modules'],
    alias: {
      '../../core-js/object/assign': 'core-js/object/assign.js',
      '../../core-js/object/create': 'core-js/object/create.js',
    },
  },
  devtool: 'source-map',
  devServer: {
    static: path.join(__dirname, 'dev'),
    historyApiFallback: true,
    hot: true,
    port: 8080,
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/index.html'),
      favicon: path.join(__dirname, 'src/favicon.png'),
    }),
  ],
};
