module.exports = {
	entry: {
		background: './src/background.js',
		contentScript: './src/contentScript.js',
		devtools: './src/devtools.js',
		initializer: './src/initializer.js',
		panel: './src/panel.js'
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel'
			},
			{
				test: /(\.html|\.css|\.png)$/,
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
