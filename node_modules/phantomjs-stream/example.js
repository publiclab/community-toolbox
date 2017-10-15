var phantom = require('./');

var browser = phantom();

browser.pipe(process.stdout);
setTimeout(browser.kill.bind(browser), 2000);

browser.end('console.log(window.location)');
