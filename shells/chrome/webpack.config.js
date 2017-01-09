module.exports = {
	entry: {
		['content-script']: './src/content-script.js',
		background: './src/background.js',
		devtools: './src/devtools.js',
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
