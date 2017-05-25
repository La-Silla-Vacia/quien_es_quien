const path = require('path');
const webpack = require('webpack'); //to access built-in plugins
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

//process.traceDeprecation = true;

const config = {
  entry: ['whatwg-fetch', './debug.js'],
  output: {
    //path: __dirname,
    filename: './script.js'
  },
  devtool: 'inline-source-map',
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        options: {
          presets: [['es2015', 'react'], 'stage-2'],
          plugins: [["transform-react-jsx"]]
        }
      },
      {
        test: /\.json$/,
        loaders: ['json-loader']
      },
      {
        test: /\.css$/,
        loader: ['style-loader', 'style-loader','css-loader?importLoaders=1'],
        include: /global/,
      },
      {
        test: /\.css$/,
        loader: ['style-loader', 'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader'],
        exclude: /global/,
      },
      {
        test: /\.html$/,
        loaders: ['underscore-template-loader']
      },
      {
        test: /\.(csv|tsv)$/,
        loaders: ['dsv-loader']
      }
    ]
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      minimize: false,
      debug: true
      //devtool: 'inline-source-map'
    }),
    new BrowserSyncPlugin({
      // browse to http://localhost:3000/ during development,
      // ./public directory is being served
      host: 'localhost',
      port: 3000,
      server: { baseDir: [''] }
    })
  ]
};

module.exports = config;