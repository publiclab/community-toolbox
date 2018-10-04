var enstore = require('./');
var through = require('through');
var test = require('tape');
var PassThrough = require('stream').PassThrough;
var concat = require('concat-stream');

test('enstore', function(t){
  t.plan(3);

  var store = enstore();

  store.createReadStream().pipe(concat(function(res){
    t.equal(res.toString(), 'foobarbaz', 'before');
  }));

  setTimeout(function(){
    var w = store.createWriteStream();
    var p = PassThrough();
    p.pipe(w);
    p.push('foo');
    p.push('bar');

    store.createReadStream().pipe(concat(function(res){
      t.equal(res.toString(), 'foobarbaz', 'in between');
    }));

    setTimeout(function(){
      p.push('baz');
      p.push(null);

      store.createReadStream().pipe(concat(function(res){
        t.equal(res.toString(), 'foobarbaz', 'after');
      }));
    });
  });
});

