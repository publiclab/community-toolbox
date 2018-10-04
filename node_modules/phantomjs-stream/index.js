var spawn = require('child_process').spawn;
var Duplex = require('stream').Duplex;
var fs = require('fs');
var tmpdir = require('os').tmpdir;
var join = require('path').join;
var inherits = require('util').inherits;
var read = require('stream-read');
var PassThrough = require('stream').PassThrough;

module.exports = Phantom;
inherits(Phantom, Duplex);

function Phantom(){
  if (!(this instanceof Phantom)) return new Phantom();
  Duplex.call(this);

  this.source = '';
  this.ps = null;
  this.buf = new PassThrough;
  this.killed = false;

  this.on('finish', this._onfinish.bind(this));
}

Phantom.prototype._write = function(chunk, _, done){
  this.source += chunk.toString();
  done();
};

Phantom.prototype._read = function(){
  var self = this;
  read(this.buf, function(err, data){
    if (err) return self.emit('error', err);
    self.push(data);
  });
};

Phantom.prototype._onfinish = function(){
  if (this.killed) return;
  var self = this;
  var rand = Math.random().toString(16).slice(2);
  var file = join(tmpdir(),'phantomjs-stream:' + rand);

  fs.writeFile(file, self.source, function(err){
    if (self.killed) return;
    if (err) return dup.emit('error', err);

    self.ps = spawn('phantomjs', [file]);
    self.ps.stdout.pipe(self.buf);
    self.ps.stderr.pipe(self.buf);
    self.ps.on('exit', self.emit.bind(self, 'exit'));
  });
};

Phantom.prototype.kill = function(){
  if (this.ps) this.ps.kill();
  this.killed = true;
};

