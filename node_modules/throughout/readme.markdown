# throughout

Apply a through stream to the output side of another through stream,
preserving the first stream as input in the returned stream.

[![build status](https://secure.travis-ci.org/substack/throughout.png)](http://travis-ci.org/substack/throughout)

[![browser support](https://ci.testling.com/substack/throughout.png)](http://ci.testling.com/substack/throughout)

# example

``` js
var through = require('through');
var throughout = require('throughput');

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
```

# rationale

If you want to transform just the output side of a through stream, this is
actually somewhat difficult and it's not immediately obvious why something like:

``` js
var duplexer = require('duplexer');

function filterOutput (a, b) {
    a.pipe(b);
    return duplexer(a, b);
}
```

shouldn't just work. The worst part is that it *does* work, until you try to
pipe the results to a slow endpoint that will throttle with pause and resume.

The problem is that both `duplexer` and `.pipe()` will handle pause and resume
in a mutually exclusive way that will cause the stream to hang indefinitely if a
slow downstream consumer ever triggers a pause.

If you try to use event-stream's .pipeline() function you will get the same
problem.

# methods

``` js
var throughout = require('throughout');
```

## var c = throughout(a, b)

Pipe the output of a through stream `a` into the input of a through stream `b`,
returning a new stream `c` that writes its input to `a` and forwards the output
from `b`.

# install

With [npm](https://npmjs.org) do:

```
npm install throughout
```

# license

MIT
