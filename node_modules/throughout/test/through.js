var test = require('tape');
var through = require('through');
var concat = require('concat-stream');
var throughout = require('../');

test('doubler counter', function (t) {
    t.plan(1);
    
    var doubler = through(function (buf) {
        var dbuf = new Buffer(buf.length * 2);
        for (var i = 0; i < dbuf.length; i++) {
            dbuf[i] = buf[Math.floor(i/2)];
        }
        this.queue(dbuf);
    });

    var counter = through(
        function (buf) {
            this._count = (this._count || 0) + buf.length;
        },
        function () {
            this.queue(this._count + '\n');
            this.queue(null);
        }
    );
    
    var tr = throughout(doubler, counter);
    tr.pipe(concat(function (err, body) {
        t.equal(body, '8\n');
    }));
    
    tr.write('a');
    tr.pause();
    setTimeout(function () { tr.write('b') }, 20);
    setTimeout(function () { tr.resume() }, 25);
    setTimeout(function () { tr.write('c') }, 50);
    setTimeout(function () { tr.end('\n') }, 60);
});
