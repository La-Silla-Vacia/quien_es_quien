const path = require('path');
const webpack = require('webpack'); //to access built-in plugins

const config = {
  entry: ['whatwg-fetch', './debug.js'],
  output: {
    // path: path.resolve(__dirname, '../dist'),
    filename: './dist/script.js'
  },
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
        loader: ['style-loader', 'css-loader?modules&importLoaders=1&localIdentName=lsvi__[hash:base64:7]!postcss-loader'],
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
      minimize: true,
      debug: false
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
      output: {
        comments: false,
      },
      sourceMap: false,
    })
  ]
};

module.exports = config;