const staticFiles = require.context('.', true, /.*(\.css|\.png|\.html)/);

staticFiles.keys().forEach(function(key){
	staticFiles(key);
});
