const staticFiles = require.context('.', true, /.*(\.scss|\.png|\.html)/);

staticFiles.keys().forEach(function(key){
	staticFiles(key);
});
