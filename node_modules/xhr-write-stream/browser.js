var http = require('http');
var Stream = require('stream');
var encode = typeof encodeURIComponent !== 'undefined'
    ? encodeURIComponent : escape
;

module.exports = function (opts) {
    if (typeof opts === 'string') {
        opts = { path : opts };
    }
    if (!opts) opts = {};
    if (!opts.id) {
        opts.id = Math.floor(Math.pow(16, 8) * Math.random()).toString(16);
    }
    
    var stream = new Stream;
    stream.writable = true;
    stream.order = 0;
    
    stream.write = function (msg) {
        if (stream.ended) return;
        var data = 'order=' + stream.order
            + '&data=' + encode(msg)
            + '&id=' + encode(opts.id)
        ;
        stream.order ++;
        send(data);
    };
    
    stream.destroy = function () {
        stream.ended = true;
        stream.emit('close');
    };
    
    stream.end = function (msg) {
        if (stream.ended) return;
        
        var data = 'order=' + stream.order
            + '&id=' + encode(opts.id)
            + '&end=true'
        ;
        if (msg !== undefined) data += '&data=' + encode(msg);
        stream.order ++;
        send(data);
        stream.ended = true;
        stream.emit('close');
    };
    
    function send (data) {
        var params = {
            method : 'POST',
            host : opts.host || window.location.hostname,
            port : opts.port || window.location.port,
            path : opts.path || '/',
            headers : {
                'content-type' : 'application/x-www-form-urlencoded'
            }
        };
        var req = http.request(params);
        req.end(data);
    }
    
    return stream
};
