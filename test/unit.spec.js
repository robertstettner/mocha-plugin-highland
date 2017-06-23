'use strict';

require('should');
const _ = require('highland');

delete require.cache[require.resolve('mocha/lib/runnable')];
const Runnable = require('mocha/lib/runnable');
require('../lib/')(Runnable); //apply plugin
require('../lib/')(Runnable); //..only once

describe('mocha-highland', () => {
    describe('synchronous', function () {
        it('should pass', function (done) {
            const test = new Runnable('synchronous', function () { });
            test.run(done);
        });

        it('should fail', function (done) {
            const test = new Runnable('synchronous', function () {
                throw new Error('You had one job');
            });

            test.run(function (err) {
                err.should.be.ok();
                err.message.should.equal('You had one job');

                return done();
            });
        });

        it('should fail with custom error object', function (done) {
            const test = new Runnable('synchronous', function () {
                throw 'You had one job';
            });

            test.run(function (err) {
                err.should.be.ok();
                err.message.should.equal('You had one job');

                return done();
            });
        });
    });

    describe('promise', function () {
        it('should pass', function (done) {
            const test = new Runnable('promise', function () {
                return Promise.resolve(true);
            });

            test.run(done);
        });

        it('should fail', function (done) {
            const test = new Runnable('promise', function () {
                return new Promise(function (resolve, reject) {
                    return setTimeout(function () {
                        return reject(new Error('You promised me'));
                    }, 0);
                });
            });

            test.run(function (err) {
                err.should.be.ok();
                err.message.should.equal('You promised me');

                return done();
            });
        });
    });

    describe('callback', function () {
        it('should pass', function (done) {
            const test = new Runnable('callback', function (d) {
                return setTimeout(d, 0);
            });

            test.run(done);
        });

        it('should fail', function (done) {
            const test = new Runnable('callback', function (d) {
                return setTimeout(function () {
                    return d(new Error('You never called me back'));
                }, 0);
            });

            test.run(function (err) {
                err.should.be.ok();
                err.message.should.equal('You never called me back');

                return done();
            });
        });
    });

    describe('highland stream', function () {
        it('should pass', function (done) {
            const test = new Runnable('stream', function () {
                return _([0,1,2]);
            });

            test.run(done);
        });

        it('should fail with error in stream', function (done) {
            const test = new Runnable('stream', function () {
                return _.fromError(new Error('You never called me back'));
            });

            test.run(function (err) {
                err.should.be.ok();
                err.message.should.equal('You never called me back');

                return done();
            });
        });

        it('should fail with error thrown in side-effect', function (done) {
            const test = new Runnable('stream', function () {
                return _([0,1,2]).tap(() => {
                    throw new Error('You never called me back');
                });
            });

            test.run(function (err) {
                err.should.be.ok();
                err.message.should.equal('You never called me back');

                return done();
            });
        });
    });
});
