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
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-react'],
          plugins: ['@babel/plugin-proposal-class-properties']
        }
      },
      {
        test: /\.css$/,
        loader: ['style-loader', 'style-loader', { loader: 'css-loader', options: { importLoaders: 1 } }],
        include: /global/,
      },
      {
        test: /\.css$/,
        loader: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: true
            }
          },
          'postcss-loader'
        ],
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
      server: { baseDir: ['./'] }
    })
  ]
};

module.exports = config;