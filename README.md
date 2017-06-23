# mocha-plugin-highland

[![Build Status](https://travis-ci.org/robertstettner/mocha-plugin-highland.svg?branch=master)](https://travis-ci.org/robertstettner/mocha-plugin-highland)
[![Coverage Status](https://coveralls.io/repos/github/robertstettner/mocha-plugin-highland/badge.svg?branch=master)](https://coveralls.io/github/robertstettner/mocha-plugin-highland?branch=master)

A [mocha](https://github.com/mochajs/mocha) plugin to enable Highland stream (using [highland](http://highlandjs.org/)) support.


## Installation
* `npm install --save-dev mocha-plugin-highland`
* just add `-r mocha-plugin-highland` in your mocha command line npm script in `package.json`
```json
{
  "scripts" : {
    "test": "node node_modules/mocha/bin/_mocha -r mocha-plugin-highland",
    "coverage": "node node_modules/istanbul/lib/cli.js cover node_modules/mocha/bin/_mocha -- -r mocha-plugin-highland"
  }
}
```

## Example Usage
```javascript
require('should');
var fs = require('fs');
var _ = require('highland');

var readFile = _.wrapCallback(fs.readFile);

describe('sometest', function () {
  it('should read file and output a collection of names', () => 
    readFile('myfile.txt')
    .map(toUpperCase)
    .map(function (x) {
        return {name: x};
    })
    .collect()
    .tap(arr => {
        arr.should.containDeep([
            { name: 'Joe' },
            { name: 'Emma' },
            { name: 'Harry' },
            { name: 'Rachel' }
        ]);
    })
  );

  it('does not change classical usage', function (done) {
    setTimeout(done, 2000);
    console.log('All good');
  });
});
```


## How It Works

The module monkey patches the `Runnable.prototype.run` method of `mocha` to enable the usage of Highland streams. In contrast to other npm packages, this is a plugin and extends `mocha` at runtime - allowing you to use any compatible mocha version.

## License

MIT