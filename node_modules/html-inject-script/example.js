var htmlInject = require('./')


process.stdin // <html><head></head><body>hello</body></html>
.pipe( htmlInject(['./app.js', './extra.js']) )
.pipe( process.stdout )