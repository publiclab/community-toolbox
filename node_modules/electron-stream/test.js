var electron = require('./');
var test = require('tape');
var concat = require('concat-stream');

test('stdout', function(t){
  var browser = electron();

  browser.stdout.on('data', function(l){
    t.equal(l.toString(), 'log\n');
    t.end();
  });

  browser.end('console.log("log");window.close()');
});

test('stderr', function(t){
  var browser = electron();

  browser.stderr.on('data', function(l){
    t.equal(l.toString(), 'error\n');
    t.end();
  });

  browser.end('console.error("error");window.close()');
});

test('stdall', function(t){
  var browser = electron();

  browser.stdall.pipe(concat(function(data){
    t.ok(data.toString().indexOf('log') > -1);
    t.ok(data.toString().indexOf('error') > -1);
    t.end();
  }));

  browser.write('console.log("log");');
  browser.write('console.error("error");');
  browser.end('window.close();');
});


test('duplex', function(t){
  var browser = electron();

  browser.pipe(concat(function(data){
    t.ok(data.toString().indexOf('log') > -1);
    t.ok(data.toString().indexOf('error') > -1);
    t.end();
  }));

  browser.write('console.log("log");');
  browser.write('console.error("error");');
  browser.end('window.close();');
});

test('exit event', function(t){
  var browser = electron();

  browser.on('exit', function(code){
    t.equal(code, 0);
    t.end();
  });

  browser.end('window.close()');
});

test('early kill', function(t){
  var browser = electron();

  browser.on('exit', function(code){
    t.equal(code, 0);
    t.end();
  });

  browser.kill();
});

test('kill', function(t){
  var browser = electron();

  browser.on('exit', function(code){
    t.equal(code, 0);
    t.end();
  });

  browser.end('console.log("foo")');
  browser.kill();
});

test('uncaught error', function(t){
  var browser = electron();

  browser.stderr.pipe(concat(function(data){
    var out = data.toString();
    t.ok(out.indexOf('Error') > -1);
    t.ok(out.indexOf(':1') > -1);
    t.end();
  }));

  browser.end('throw new Error(\'bar\')');
});

test('http protocol', function(t){
  var browser = electron();
  browser.pipe(concat(function(data){
    t.equal(data.toString(), 'http:\n');
    t.end();
  }));
  browser.end('console.log(location.protocol);window.close();');
});

test('no node integration', function(t){
  var browser = electron();
  browser.pipe(concat(function(data){
    t.ok(data.toString().indexOf('ReferenceError') > -1);
    t.end();
  }));
  browser.end('console.log(!!process.version);window.close();');
});

test('node integration', function(t){
  var browser = electron({
    nodeIntegration: true
  });
  browser.pipe(concat(function(data){
    t.equal(data.toString(), 'true\n');
    t.end();
  }));
  browser.end('console.log(!!process.version);window.close();');
});

test('require node modules', function(t){
  var browser = electron({
    nodeIntegration: true,
    basedir: __dirname
  });
  browser.pipe(concat(function(data){
    t.equal(data.toString(), 'true\n');
    t.end();
  }));
  browser.end('console.log(!!require.resolve("tape"));window.close();');
});

test('circular structure in opts', function(t){
  var o = {}
  o.o = o

  var browser = electron(o);
  browser.pipe(concat(function(data){
    t.equal(data.toString(), 'true\n');
    t.end();
  }));
  browser.end('console.log(true);window.close();');
});

test('access document.body', function(t){
  var browser = electron();
  browser.pipe(concat(function(data){
    t.equal(data.toString(), 'true\n');
    t.end();
  }));
  browser.end('console.log(!!document.body);window.close();');
});

test('utf8', function(t){
  var browser = electron();
  browser.pipe(concat(function(data){
    t.equal(data.toString(), 'ಠ\n');
    t.end();
  }));
  browser.end('var ಠ = "ಠ";console.log(ಠ);window.close();');
});

test('closing scripts do not break', function(t){
  var browser = electron();
  browser.pipe(concat(function(data){
    t.equal(data.toString(), '</script>\n');
    t.end();
  }));
  browser.end('console.log("</script>");window.close();');
});
