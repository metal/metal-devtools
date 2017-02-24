var webpack = require('webpack');

var srcDir = __dirname + '/src';

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
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel'
			},
			{
				test: /(\.html|\.png|\.svg|\.json)$/,
				loader: 'file?name=[name].[ext]'
			},
			{
				test: /\.scss$/,
				loaders: ['style', 'css', 'sass']
			}
		]
	},
	output: {
		filename: '[name].js',
		path: __dirname + '/build'
	},
	plugins: [
		new webpack.IgnorePlugin(/regenerator|nodent|js-beautify/, /ajv/)
	]
};
