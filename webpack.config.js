'use strict';
/*eslint-env node*/
const webpack = require('webpack');
const path = require('path');
const autoprefixer = require('autoprefixer');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');


const NODE_ENV = process.env.NODE_ENV;
const env = {
  development: NODE_ENV === 'development',
  production: NODE_ENV === 'production' || typeof NODE_ENV === 'undefined',
};

const buildFolder = path.resolve(__dirname, 'src/main/webapp');
const js = path.resolve(__dirname, 'src/main/javascript');
const scss = path.resolve(__dirname, 'src/main/scss');
const resources = path.resolve(__dirname, 'src/main/resources');

const preSuffix = env.development ? '' : '.min';

let config = {
  entry: [
    `${js}/index.jsx`,
  ],

  module: {
    preLoaders: [{
      test: /\.jsx?$/,
      loader: 'eslint',
      exclude: /node_modules/,
    }],

    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: `${env.development ? 'react-hot!' : ''}babel`,
    }, {
      // Moves images to webapp/imgs
      test: /\.(png|jpe?g)$/,
      exclude: /node_modules/,
      loader: 'file?name=imgs/[name].[ext]',
    }],
  },

  modulesDirectories: [
    'node_modules',
  ],

  node: {
    console: true,
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },

  resolve: {
    extensions: ['', '.js', '.jsx', '.scss'],
    alias: {
      'FF': `${js}`,
      'FF-scss': `${scss}`,
      'FF-resources': resources,
    },
  },

  output: {
    path: `${buildFolder}`,
    filename: `bundle${preSuffix}.js`,
  },

  plugins: [
    new webpack.DefinePlugin({
      // Allows extra minification for prod
      'process.env': {
        NODE_ENV: JSON.stringify(NODE_ENV || 'production'),
      },
    }),
  ],

  postcss: function() {
    return [autoprefixer({ browsers: ['last 2 version', 'ie >= 10']})];
  },
};

if(env.development) {

  console.log("\n\n IN DEV!! \n\n");

  const clientProtocol = "http:";
  const clientHost = "localhost";
  const clientPort = "3000";

  const devUrl = `${clientProtocol}//${clientHost}:${clientPort}`;

  config.cache = true;
  config.devServer = {
    contentBase: buildFolder,
    devtool: 'eval',
    historyApiFallback: true,
    hot: true,
    port: clientPort,
  };

  config.devtool = 'eval';

  config.entry = [
    `webpack-dev-server/client?${devUrl}`,
    'webpack/hot/only-dev-server',
  ].concat(config.entry);

  config.module.loaders = config.module.loaders.concat([{
    test: /\.scss$/,
    exclude: /node_modules/,
    loader: 'style!css!postcss!sass?outputStyle=expanded&sourceMap=true',
  }]);

  config.output.publicPath = `/`;

  config.plugins = config.plugins.concat([
    new HtmlWebpackPlugin({
      template: 'src/main/resources/index.html',
      inject: 'body',
    }),
    new webpack.HotModuleReplacementPlugin(),
  ]);

} else {

  console.log("\n\n IN PROD!!!! \n\n");

  config.module.loaders = config.module.loaders.concat([{
    test: /\.scss$/,
    exclude: /node_modules/,
    loader: ExtractTextPlugin.extract('style-loader', 'css!postcss!sass?outputStyle=compressed'),
  }]);

  config.plugins = config.plugins.concat([
    // Extracts compiled css into separate files
    new ExtractTextPlugin(`main.css`),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false },
      output: { comments: false },
    }),
  ]);
}

config.module.loaders = config.module.loaders.concat([{
  test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
  loader: 'url?limit=10000&mimetype=application/font-woff&name=fonts/[name].[ext]',
}, {
  test: /\.(ttf|otf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
  loader: 'file?name=fonts/[name].[ext]',
}]);

module.exports = config;