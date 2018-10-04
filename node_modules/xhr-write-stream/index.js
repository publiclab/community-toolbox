var qs = require('querystring');
var OrderedEmitter = require('ordered-emitter');
var Stream = require('stream');
var concatStream = require('concat-stream');

module.exports = function (opts) {
    if (!opts) opts = {};
    
    var ord = new OrderedEmitter;
    var streams = {};
    
    return function (cb) {
        var cs = concatStream(function (err, data) {
            if (err) return;
            
            var params = qs.parse(String(data));
            if (!params) return;
            params.order = Number(params.order);
            var s = streams[params.id];
            
            if (!s) {
                s = streams[params.id] = createStream(params.id, opts);
                s.once('close', function () {
                    delete streams[params.id];
                    if (!cs.closed) cs.emit('close');
                });
                cb(s);
            }
            if (opts.timeout) s.resetTimeout();
            s.ordered.emit('params', params);
        });
        
        cs.once('close', function () { cs.closed = true });
        
        return cs;
    };
};

function createStream (id, opts) {
    var s = new Stream;
    s.readable = true;
    
    s.resetTimeout = function () {
        if (s.timeout) clearTimeout(s.timeout);
        s.timeout = setTimeout(function () {
            s.emit('timeout');
            s.emit('close');
        }, opts.timeout);
    }
    if (opts.timeout) s.resetTimeout();
    
    s.ordered = new OrderedEmitter;
    s.ordered.on('params', function (params) {
        if (params.data !== undefined) s.emit('data', params.data)
        if (params.end) {
            if (s.timeout) clearTimeout(s.timeout);
            s.emit('end');
            s.emit('close');
        }
    });
    
    return s;
}
