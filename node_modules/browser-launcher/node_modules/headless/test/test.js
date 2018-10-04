var assert = require('assert');
var headless = require('../index');

setTimeout(function() {
  throw new Error('Timeout 2 seconds. You don\'t have xvfb installed or something else is seriously wrong.');
}, 2000);

headless(function(err, child, servernum) {
  assert.equal(err, null);
  assert.equal(typeof(child), 'object');
  assert.equal(typeof(child.kill), 'function');
  assert.equal(typeof(servernum), 'number');
  child.kill();
  child.on('exit', process.exit);
});