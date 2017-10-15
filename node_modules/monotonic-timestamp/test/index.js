var ts = require('..')
var assert = require('assert')
var max = 1000000
var l = max
var prev = 0
//assert that timestamps are strictly increasing!
while (l--) {
  var t = ts()
  if(prev >= t) {
    console.log('collision', prev, t, 'after', max - l)
    assert(prev < t)
  }
  prev = t
}

