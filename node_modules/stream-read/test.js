var Readable = require('stream').Readable;
var through = require('through');
var read = require('./');
var test = require('tape');

test('push read', function(t){
  var stream = through();

  read(stream, function(err, val){
    t.error(err);
    t.equal(val, 'foo');
    read(stream, function(err, val){
      t.error(err);
      t.equal(val, 'bar');
      read(stream, function(err, val){
        t.error(err);
        t.equal(val, undefined);
        t.end();
      });
    });
  });

  stream.queue('foo');
  stream.queue('bar');
  stream.queue(null);
});

test('push error', function(t){
  var stream = through();

  read(stream, function(err){
    t.ok(err);
    t.end();
  });

  stream.emit('error', new Error);
});

test('push backpressure', function(t){
  var stream = through();

  read(stream, function(err, val){
    t.error(err);
    t.equal(val, 'foo');
    read(stream, function(err, val){
      t.error(err);
      t.equal(val, 'bar');
      read(stream, function(err, val){
        t.error(err);
        t.equal(val, undefined);
        t.end();
      });
    });
  });

  setTimeout(function(){
    stream.queue('foo');
    setTimeout(function(){
      stream.queue('bar');
      setTimeout(function(){
        stream.queue(null);
      });
    });
  });
});

test('pull read', function(t){
  var times = 3;

  var stream = Readable();
  stream._read = function(){
    if (!times--) return stream.push(null);
    setTimeout(function() {
      stream.push('foo');
    });
  };

  read(stream, function(err, val){
    t.error(err);
    t.equal(val.toString(), 'foo');
    read(stream, function(err, val){
      t.error(err);
      t.equal(val.toString(), 'foo');
      read(stream, function(err, val){
        t.error(err);
        t.equal(val.toString(), 'foo');
        read(stream, function(err, val){
          t.error(err);
          t.equal(val, null);
          t.end();
        });
      });
    });
  });
});

test('pull read 2', function(t){
  var times = 2;

  var stream = Readable();
  stream._read = function(){
    setTimeout(function() {
      if (times-- > 0) {
        stream.push('foo');
        stream.push('bar');
      } else {
        stream.push(null);
      }
    });
  };

  read(stream, function(err, val){
    t.error(err);
    t.equal(val.toString(), 'foo');
    read(stream, function(err, val){
      t.error(err);
      t.equal(val.toString(), 'bar');
      read(stream, function(err, val){
        t.error(err);
        t.equal(val.toString(), 'foo');
        read(stream, function(err, val){
          t.error(err);
          t.equal(val.toString(), 'bar');
          read(stream, function(err, val){
            t.error(err);
            t.equal(val, null);
            t.end();
          });
        });
      });
    });
  });
});

test('pull end', function(t){
  var stream = Readable();
  stream.push(null);

  read(stream, function(err, val){
    t.error(err);
    t.equal(val, null);
    read(stream, function(err, val){
      t.error(err);
      t.equal(val, undefined);
      t.end();
    });
  });
});

test('pull error', function(t){
  var stream = Readable();
  stream._read = function() {
    stream.emit('error', new Error);
  };

  read(stream, function(err){
    t.ok(err);
    t.end();
  });
});

test('pull double end', function(t){
  t.plan(1);
  var stream = Readable();
  stream._read = function(){ this.push(null) };
  read(stream, function(err, val){
    t.equal(val, null);
  });
  stream.emit('end');
});

