'use strict';

/**
 * Monkey patch the mocha instance with highland stream support.
 *
 * @param {Function} mocha
 */

const isHighlandStream = x => typeof x === 'object' && x !== null && !!x.__HighlandStream__;

function highlandRunnable (Runnable) {
    // Avoid loading `mocha-plugin-highland` twice.
    if (Runnable._highlandsupport) {
        return;
    }

    const run = Runnable.prototype.run;

    Runnable.prototype.run = function (fn) {
        const oldFn = this.fn;
        const oldFnAsync = oldFn.length;
        this.async = true;
        this.sync  = !this.async;

        this.fn = function (done) {
            new Promise((resolve, reject) => {
                const result = oldFn.call(this, function (err, x) {
                    if (err) return reject(err);
                    resolve(x);
                });
                if (!oldFnAsync) resolve(result);
            }).then(x => {
                if(isHighlandStream(x)) return x.collect().toCallback(done);
                done();
            }).catch(err => {
                if (!(err instanceof Error)) err = Error(err);
                process.nextTick(done, err);
            });
        };

        return run.call(this, fn);
    };

    Runnable._highlandsupport = true;
}

module.exports = highlandRunnable;