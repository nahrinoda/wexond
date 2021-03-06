const webpack = require('webpack');
const merge = require('webpack-merge');
const { resolve } = require('path');
const baseConfig = require('./webpack.config.base');

const PORT = 8080;

const config = merge.smart(baseConfig, {
  devtool: 'eval-source-map',
  mode: 'development',
  output: {
    hotUpdateChunkFilename: 'hot/hot-update.js',
    hotUpdateMainFilename: 'hot/hot-update.json',
    publicPath: `http://localhost:${PORT}/`,
    path: resolve(__dirname, 'build'),
    filename: '[name].js',
  },

  module: {
    rules: [
      {
        test: /\.(png|gif|jpg|woff2|ttf|svg)$/,
        use: ['url-loader'],
      },
    ],
  },

  plugins: [new webpack.HotModuleReplacementPlugin()],
});

const appConfig = merge.smart(config, {
  target: 'electron-renderer',

  entry: {
    app: ['react-hot-loader/patch', './src/renderer/app'],
  },

  devServer: {
    contentBase: './static/pages',
    port: PORT,
    stats: {
      colors: true,
    },
    watchOptions: {
      aggregateTimeout: 300,
      ignored: /node_modules/,
      poll: 100,
    },
    hot: true,
    inline: true,
  },
});

const newTabConfig = merge.smart(config, {
  target: 'web',

  entry: {
    newtab: ['react-hot-loader/patch', './src/renderer/newtab'],
  },
});

const historyConfig = merge.smart(config, {
  target: 'web',

  entry: {
    history: ['react-hot-loader/patch', './src/renderer/history'],
  },
});

const aboutConfig = merge.smart(config, {
  target: 'web',

  entry: {
    about: ['react-hot-loader/patch', './src/renderer/about'],
  },
});

const bookmarksConfig = merge.smart(config, {
  target: 'web',

  entry: {
    bookmarks: ['react-hot-loader/patch', './src/renderer/bookmarks'],
  },
});

module.exports = [
  appConfig,
  newTabConfig,
  historyConfig,
  aboutConfig,
  bookmarksConfig,
];
