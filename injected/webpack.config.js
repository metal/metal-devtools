var srcDir = __dirname + '/src';

module.exports = {
	entry: {
		installHook: srcDir + '/installHook.js',
		processComponents: srcDir + '/processComponents.js'
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel'
			}
		]
	},
	output: {
		filename: '[name].js',
		path: __dirname + '/build'
	}
};
