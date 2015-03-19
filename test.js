var assert = require('assert');
var fs = require('fs');
var exec = require('child_process').exec;
var path = require('path');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');

var rekContents = fs.readFileSync('index.js');

describe('rek', function() {

  describe('has a property root', function() {

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

    it('is the root of the project', function(done) {
      mkdirp.sync('test/a/b/c/d');
      fs.writeFileSync(
        'test/a/b/c/d/index.js',
        'console.log(require("rek").root);'
      );
      exec('node test/a/b/c/d/index.js', function(err, out) {
        assert.equal(
          path.resolve(out.trim()),
          path.resolve('test')
        );
        done();
      })
    });

  });

  describe('in a non nested node_modules setup', function() {

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


  describe('in a nested node_modules setup', function() {

    beforeEach(function() {
      rimraf.sync('test');
      mkdirp.sync('test/node_modules/foo/node_modules/rek');
      fs.writeFileSync(
        'test/node_modules/foo/node_modules/rek/index.js',
        rekContents
      );
    });

    afterEach(function() {
      rimraf.sync('test');
    });

    it('can require nested modules without the crazy ../../', function(done) {
      mkdirp.sync('test/node_modules/foo/a/b/c/d');
      fs.writeFileSync(
        'test/node_modules/foo/a/b/c/d/index.js',
        'console.log(require("rek")("x/y/z"));'
      );
      mkdirp.sync('test/node_modules/foo/x/y/z');
      fs.writeFileSync(
        'test/node_modules/foo/x/y/z/index.js',
        'module.exports = "found me!";'
      );
      exec('node test/node_modules/foo/a/b/c/d/index.js', function(err, out) {
        assert.equal(out.trim(), 'found me!');
        done();
      })
    });

  });

  describe('when the file only exists in node_modules', function() {

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

    it('fallsback to the old require functionality', function(done) {
      mkdirp.sync('test/a/b/c/d');
      fs.writeFileSync(
        'test/a/b/c/d/index.js',
        'console.log(require("rek")("x/y/z"));'
      );
      mkdirp.sync('test/node_modules/x/y/z');
      fs.writeFileSync(
        'test/node_modules/x/y/z/index.js',
        'module.exports = "found the module!";'
      );
      exec('node test/a/b/c/d/index.js', function(err, out) {
        assert.equal(out.trim(), 'found the module!');
        done();
      })
    });

  });

  describe("when it can't find the file anywhere", function() {

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

    it('throws', function(done) {
      mkdirp.sync('test/a/b/c/d');
      fs.writeFileSync(
        'test/a/b/c/d/index.js',
        'console.log(require("rek")("x/y/z"));'
      );
      exec('node test/a/b/c/d/index.js', function(err, out) {
        assert(err.stack.match(/Cannot find module/));
        done();
      })
    });

  });


  describe('works in a browserify environment', function() {

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
      this.timeout(10000);
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
      exec('browserify test/a/b/c/d/index.js | node', function(err, out) {
        assert.equal(out.trim(), 'found me!');
        done();
      })
    });

  });


});
