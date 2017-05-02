const staticFiles = require.context('.', true, /.*(\.scss|\.png|\.svg|\.html)/);

staticFiles.keys().forEach(function(key) {
  staticFiles(key);
});
