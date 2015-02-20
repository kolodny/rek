var assert = require('assert');
var fs = require('fs');
var exec = require('child_process').exec;
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');

var rekContents = fs.readFileSync('index.js');

describe('rek', function() {

  beforeEach(function() {
    rimraf.sync('test');
    mkdirp.sync('test/node_modules/rek/');
    fs.writeFileSync(
      'test/node_modules/rek/index.js',
      rekContents
    );
  });

  afterEach(function() {
    rimraf.sync('test');
  });

  it('can require nested modules without the crazy ../../', function(done) {
    mkdirp.sync('test/a/b/c/d');
    fs.writeFileSync(
      'test/a/b/c/d/index.js',
      'console.log(require("rek")("x/y/z"));'
    );
    mkdirp.sync('test/x/y/z');
    fs.writeFileSync(
      'test/x/y/z/index.js',
      'module.exports = "found me!";'
    );
    exec('node test/a/b/c/d/index.js', function(err, out) {
      assert.equal(out.trim(), 'found me!');
      done();
    })
  });
});
