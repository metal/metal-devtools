const srcDir = __dirname + '/src';

module.exports = {
  entry: {
    background: srcDir + '/background.js',
    contentScript: srcDir + '/contentScript.js',
    devtools: srcDir + '/devtools.js',
    initializer: srcDir + '/initializer.js',
    panel: srcDir + '/panel.js'
  },
  module: {
    loaders: [
      {
        exclude: /node_modules/,
        loader: 'babel',
        test: /\.js$/
      },
      {
        loader: 'file?name=[name].[ext]',
        test: /(\.html|\.png|\.svg)$/
      },
      {
        loaders: ['style', 'css', 'sass'],
        test: /\.scss$/
      }
    ]
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/build'
  }
};
