var srcDir = __dirname + '/src';

module.exports = {
	entry: {
		installInitialHook: srcDir + '/installInitialHook.js',
		installRootManagerHook: srcDir + '/installRootManagerHook.js'
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
