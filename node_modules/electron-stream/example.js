var electron = require('./');

var browser = electron();

browser.pipe(process.stdout);

browser.write('console.log("hey");');
browser.write('window.close()');
browser.end();
