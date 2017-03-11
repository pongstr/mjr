'use strict';

const path     = require('path')
const basePath = process.cwd()

module.exports = {
  context: `${basePath}/src/app`,
  entry: 'app.js',
  output: {
    path: `${basePath}/app/assets`,
    filename: 'app.[name].js',
    chunkFilename: 'app.[id].js'
  },
  module: {
    preLoaders: [
      {test: /\.html$/, loader: 'raw!html-minify'}
    ],
    loaders: [
      {
        test: /\.js?$/,
        exclude: /^(node_modules|bower_components)$/,
        include: [
          path.resolve(basePath, 'src'),
          path.resolve(basePath, 'test')
        ],
        loader: 'babel',
        cacheDirectory: false,
        query: {
          presets: ['es2015'],
          // Let Babel include superflous whitespace characters and line
          // terminators. We set this to false so we can peacefully include
          // loopback-angular-sdk, see: http://goo.gl/qwRzxi
          compact: false
        }
      }
    ]
  },
  resolve: {
    modulesDirectories: [path.join(basePath, './node_modules')],
    root: [path.resolve(basePath, 'src')]
  },
  externals: {
    'angular': 'angular'
  }
}
