var EventEmitter = require('events').EventEmitter;
var inherits = require('util').inherits;
var timestamp = require('monotonic-timestamp');
var Writable = require('stream').Writable;
var Readable = require('stream').Readable;

module.exports = Store;
inherits(Store, EventEmitter);

function Store(){
  if (!(this instanceof Store)) return new Store();
  EventEmitter.call(this);
  this.store = [];
  this.ended = false;
}

Store.prototype.createWriteStream = function(opts){
  var self = this;
  var w = Writable(opts);
  w._write = function(chunk, _, done){
    chunk = {
      ts : timestamp(),
      chunk : chunk
    }
    self.store.push(chunk);
    self.emit('chunk', chunk);
    done();
  };
  w.on('finish', function(){
    self.ended = true;
    self.emit('end');
  });
  return w;
};

Store.prototype.createReadStream = function(opts){
  var self = this;
  var idx = 0;
  var r = Readable(opts);
  r._read = function(n){
    if (self.store[idx]) return r.push(self.store[idx++].chunk);
    if (self.ended) return r.push(null);

    var onchunk = function(chunk){
      self.removeListener('end', onend);
      idx++;
      r.push(chunk.chunk);
    }
    self.once('chunk', onchunk);

    var onend = function(){
      self.removeListener('chunk', onchunk);
      r.push(null);
    };
    self.once('end', onend);
  };
  return r;
};
