var dirname = __dirname.replace(/\\/g, '/');
var root = dirname.slice(0, dirname.lastIndexOf('/node_modules/') + 1);

if (process.browser) {
  root = './' + root;
}

module.exports = function(file) {
  try {
    return require(root + file);
  } catch (e) {
    return require(file);
  }
}
module.exports.root = root;
