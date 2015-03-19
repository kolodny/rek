rek
===

[![Build Status](https://travis-ci.org/kolodny/rek.svg?branch=master)](https://travis-ci.org/kolodny/rek)

require without relative paths

usage

```js
var rek = require('rek');

// in file project/a/b/c/d/index.js
// we want project/x/y/z/index.js
var xyz = rek('x/y/z');

console.log(rek.root); // the path the project root
```

Works in browserify too!

## Warning

This will seriously break if you have multiple modules using rek and you do a `npm dedupe`
