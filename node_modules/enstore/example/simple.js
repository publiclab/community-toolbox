var enstore = require('..');
var through = require('through');

var store = enstore();
read('initial');

var src = through();
src.pipe(store.createWriteStream());

var i = 0;
(function write () {
  src.write('hey ' + i++);

  if (i == 2) {
    read('streaming');
  }
  
  if (i == 3) {
    src.end();
    return read('after');
  }

  setTimeout(write, 500);
})();

function read (name) {
  console.log('[' + name + '] reading now');
  store.createReadStream().pipe(through(function (chunk) {
    console.log('[' + name + '] ' + chunk);
  }));
}
