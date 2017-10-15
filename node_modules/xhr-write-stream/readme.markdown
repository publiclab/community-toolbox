# xhr-write-stream

Write data in the browser and receive a properly ordered stream in node from
multiple incoming requests.

This module only goes one way, from the browser to node. Use libraries like
[shoe](http://github.com/substack/shoe) to create full duplex streams between
the browser and node.

# example

browser code:

``` js
var xws = require('xhr-write-stream');

var ws = xws('/robots');
ws.write('beep boop');
ws.write('!!!');
ws.end();
```

server code:

``` js
var http = require('http');
var ecstatic = require('ecstatic')(__dirname + '/static');
var xws = require('xhr-write-stream')();

var server = http.createServer(function (req, res) {
    if (req.url === '/robots') {
        req.pipe(xws(function (stream) {
            stream.pipe(process.stdout, { end : false });
        }));
        req.on('end', res.end.bind(res));
    }
    else ecstatic(req, res)
});
server.listen(5000);
```

bundle up the browser code with
[browserify](https://github.com/substack/node-browserify):

```
$ browserify browser.js -o static/bundle.js
```

then toss down a script tag for the bundle:

``` html
<script src="bundle.js"></script>
```

Run the server and visit the page in the browser:

```
$ node server.js
beep boop!!!
```

# browser methods

``` js
var xws = require('xhr-write-stream')
```

## var ws = xws(path)

Return a writable stream that sends an xhr request to `path` on every `write()`.

The xhr requests are turned back into a single readable stream on the server
side.

# server methods

``` js
var createXWS = require('xhr-write-stream')
```

## var xws = createXWS(opts={})

Create a new `xws` stream pool.

`opts.timeout` is the time in milliseconds to wait for connection activity
before dropping the connection and removing the stream. Default value: 60*1000

## var ws = xws(cb)

Return a writable stream `ws` that you can pipe request data into from multiple
incoming xhr requests on the browser-side.

`cb(stream)` is called with a readable `stream` that aggregates data in order
with the data from each xhr request.

# install

With [npm](https://npmjs.org) do:

```
npm install xhr-write-stream
```

This module makes use of
[http-browserify](https://github.com/substack/http-browserify)
for the xhr-compatibility. If you just `require('xhr-write-stream')` in your
browser code using [browserify](https://github.com/substack/node-browserify),
everything will just work™.

# license

MIT
