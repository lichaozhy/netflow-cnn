const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
	entry: {
		bundle: [
			path.resolve('src/index.js')
		]
	},
	resolve: {
		extensions: ['.js', '.vue']
	},
	module: {
		rules: [
			{
				test: /\.vue$/,
				loader: 'vue-loader'
			},
			// {
			// 	test: /\.js$/,
			// 	exclude: /node_modules/,
			// 	loader: 'babel-loader'
			// },
			{
				test: /\.css$/,
				use: [
					'style-loader',
					'css-loader'
				]
			}
		]
	},
	plugins: [
		new VueLoaderPlugin()
	]
};