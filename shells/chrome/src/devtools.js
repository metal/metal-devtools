import './devtools.html';

chrome.devtools.panels.create(
	'Metal.js',
	'',
	'build/panel.html',
	function() {}
);
