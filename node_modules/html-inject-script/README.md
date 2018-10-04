# html-inject-script

Transform stream for injecting script tags into html.

### example:

```js
var injectScripts = require('html-inject-script')

process.stdin
.pipe( injectScripts(['./app.js', './extra.js']) )
.pipe( process.stdout )
```

input:
```html
<html><head></head><body>hello</body></html>
```
output:
```html
<html><head><script src="./app.js"></script><script src="./extra.js"></script></head><body>hello</body></html>
```

### cli

```bash
cat index.html | htmlinjectscript "app.js" > output.html
```

### Gotcha:
requires a head tag to be present in the src.