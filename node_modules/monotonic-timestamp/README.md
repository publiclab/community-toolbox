# monotonic-timestamp

Monotonically increasing timestamp.

<img src=https://secure.travis-ci.org/'Dominic Tarr'/monotonic-timestamp.png?branch=master>

This is NOT a  accurate representation of the time.
Since js only measures time as ms, if you call Date.now()
twice quickly, it's possible to get two identical time stamps.

`monotonic-timestamp` fixes that problem! (crudely)

## Example

``` js
var timestamp = require('monotonic-timestamp')

console.log(timestamp())
console.log(timestamp())
console.log(timestamp())
console.log(timestamp())
console.log(timestamp())

```

subsequent calls to timestamp() are ALWAYS strictly ordered.

## byte optimizations

My precious bytes! wasted on your timestamp!

pack it into a string!
``` js
timestamp().toString(36) 
```

of course, if you are using a binary protocol, 
it will be cheaper to use the float...

##TODO

syncronize network time.

## License

MIT
