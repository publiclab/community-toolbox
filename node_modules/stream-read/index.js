var dz = require('dezalgo');

module.exports = function read(stream, cb) {
  cb = dz(cb);
  return typeof stream.read == 'function'
    ? read2(stream, cb)
    : read1(stream, cb);
};

function read1(stream, cb) {
  if (!stream.readable) return cb();

  stream.on('data', ondata);
  stream.on('error', onerror);
  stream.on('end', onend);
  stream.resume();

  function ondata(data) {
    stream.pause();
    cleanup();
    cb(null, data);
  }

  function onerror(err) {
    cleanup();
    cb(err);
  }

  function onend(data) {
    cleanup();
    cb(null, data);
  }

  function cleanup() {
    stream.removeListener('data', ondata);
    stream.removeListener('error', onerror);
    stream.removeListener('end', onend);
  }
}

function read2(stream, cb) {
  if (!stream.readable) return cb();
  var ended = false;

  function onreadable() {
    cleanup();
    check();
  }

  function onend() {
    cleanup();
    if (!ended) {
      ended = true;
      cb(null, null);
    }
  }

  function onerror(err) {
    cleanup();
    cb(err);
  }

  function listen() {
    stream.on('readable', onreadable);
    stream.on('end', onend);
    stream.on('error', onerror);
  }

  function cleanup() {
    stream.removeListener('readable', onreadable);
    stream.removeListener('end', onend);
    stream.removeListener('error', onerror);
  }

  function check() {
    var errored = false;
    var _onerror;
    stream.on('error', _onerror = function(err){
      errored = true;
      stream.removeListener('error', _onerror);
      cb(err);
    });

    var buf = stream.read();
    stream.removeListener('error', _onerror);
    if (errored) return;
    if (buf) cb(null, buf);
    else listen();
  }

  check();
}

