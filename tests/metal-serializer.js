var printHtml = require('js-beautify').html;
var TYPE = require('./snap').TYPE;

module.exports = {
	print: function(val) {
		return printHtml(
			val.html,
			{
				indent_size: 2,
				unformatted: 'none',
				wrap_line_length: 0
			}
		);
	},

	test: function(val) {
		return val &&
			val.hasOwnProperty('type') &&
			val.type === TYPE;
	}
};
