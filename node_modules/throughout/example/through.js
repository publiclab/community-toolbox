var through = require('through');
var throughout = require('../');

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

process.stdin
    .pipe(throughout(doubler, counter))
    .pipe(process.stdout)
;
