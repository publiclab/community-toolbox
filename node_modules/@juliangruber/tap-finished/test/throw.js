var test = require('tape');
var finished = require('../');
var lines = [
    'TAP version 13',
    '# throw',
    'ok 1 (unnamed assert)',
    'Error: hmm',
    '    at Test.<anonymous> (http://localhost:51149/bundle.js:6:9)',
    '    at Test.bound [as _cb] (http://localhost:51149/bundle.js:877:32)',
    '    at Test.run (http://localhost:51149/bundle.js:893:10)',
    '    at Test.bound [as run] (http://localhost:51149/bundle.js:877:32)',
    '    at next (http://localhost:51149/bundle.js:1944:15)',
    '    at http://localhost:51149/bundle.js:37:21'
];

test(function (t) {
    t.plan(5);
    var done = false;
    
    var stream = finished({ wait: 1000 }, function (results) {
        t.equal(done, true);
        
        t.equal(results.pass.length, 1);
        t.equal(results.pass[0].ok, true);
        t.equal(results.fail.length, 0);
        
        t.notOk(results.ok);
    });
    
    var iv = setInterval(function () {
        if (lines.length === 0) {
            clearInterval(iv);
            done = true;
            stream.end();
        }
        
        var line = lines.shift();
        stream.write(line + '\n');
    }, 25);
});
