module.exports = {
	entry: {
		background: './src/extension/background.js',
		content: './src/extension/content.js',
		devtools: './src/extension/devtools/devtools.js',
		panel: './src/extension/panel/panel.js'
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel'
			},
			{
				test: /\.html$/,
				exclude: /node_modules/,
				loader: 'file?name=[name].[ext]'
			},
			{
				test: /\.css$/,
				exclude: /node_modules/,
				loader: 'file?name=[name].[ext]'
			}
		]
	},
	output: {
		filename: '[name].js',
		path: './build'
	}
};
