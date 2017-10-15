var phantom = require('./');
var test = require('tape');

test('execute', function(t){
  var browser = phantom();

  browser.on('data', function(l){
    browser.kill();
    t.ok(l);
    t.end();
  });

  browser.end('console.log(window.location)');
});

test('exit event', function(t){
  var browser = phantom();

  browser.on('exit', function(code){
    t.equal(code, 0);
    t.end();
  });

  browser.end('phantom.exit()');
});
