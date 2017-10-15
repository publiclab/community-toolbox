var xws = require('../');

var ws = xws('/robots');
ws.write('beep boop');

var ix = 0;
var iv = setInterval(function () {
    if (++ix === 30) {
        clearInterval(iv);
        ws.end('!\n');
    }
    else ws.write('!');
}, 100);
