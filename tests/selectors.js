'use strict';

var expect    = require('chai').expect,
    fs        = require('fs'),
    path      = require('path'),
    uncss     = require('./../lib/uncss.js');

/* Read file sync sugar. */
var rfs = function (file) {
    return fs.readFileSync(path.join(__dirname, file), 'utf-8').toString();
};

var rawcss = false;
var tests = fs.readdirSync(path.join(__dirname, 'fixtures/'));
var input = '';

/* Only read through CSS files */
tests.forEach(function (test, i) {
    if (test.indexOf('.css') > -1) {
        input += rfs('fixtures/' + test);
    } else {
        tests.splice(i, 1);
    }
});

describe('Selectors', function () {

    before(function (done) {
        uncss(rfs('index.html'), { csspath: 'tests' }, function (output) {
            rawcss = output;
            done();
        });
    });

    /* Test that the CSS in the 'unused' folder is not included in the generated
     * CSS
     */
    tests.forEach(function (test) {
        it('Should not output unused ' + test.split('.')[0], function () {
            expect(rawcss).to.not.include.string(rfs('unused/' + test));
        });
    });

    /* Test that the CSS in the 'expected' folder is included in the generated
     * CSS
     */
    tests.forEach(function (test) {
        it('Should output expected ' + test.split('.')[0], function () {
            expect(rawcss).to.include.string(rfs('expected/' + test));
        });
    });
});
