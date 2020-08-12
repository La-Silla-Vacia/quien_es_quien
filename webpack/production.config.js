const path = require('path');
const webpack = require('webpack'); //to access built-in plugins

const config = {
  entry: ['whatwg-fetch', './debug.js'],
  output: {
    // path: path.resolve(__dirname, '../dist'),
    filename: './script.js'
  },
  mode: 'production',
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
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
  ]
};

module.exports = config;