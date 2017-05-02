const srcDir = __dirname + '/src';

module.exports = {
  entry: {
    installInitialHook: srcDir + '/installInitialHook.js',
    installRootManagerHook: srcDir + '/installRootManagerHook.js'
  },
  module: {
    loaders: [
      {
        exclude: /node_modules/,
        loader: 'babel',
        test: /\.js$/
      }
    ]
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/build'
  }
};
