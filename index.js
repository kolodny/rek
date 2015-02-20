module.exports = function(file) {
  var root = __dirname.slice(0, __dirname.lastIndexOf('/node_modules/') + 1);
  return require(root + file);
}
