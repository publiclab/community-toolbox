var http = require('http');
var ecstatic = require('ecstatic')(__dirname + '/static');
var xws = require('../')();

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
