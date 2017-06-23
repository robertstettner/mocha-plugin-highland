'use strict';

const highlandRunnable = require('./lib/');

try {
    const mocha_path = require.resolve('mocha');
    if(require.cache[mocha_path])
        highlandRunnable(require.cache[mocha_path].exports.Runnable);
} catch(err){ }