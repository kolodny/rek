module.exports = function(file) {
  var root = __dirname.slice(0, __dirname.lastIndexOf('/node_modules/') + 1);
  try {
    return require(root + file);
  } catch (e) {
    return require(file);
  }
}
