var Trumpet = require('trumpet')

// this is to avoid the pitfalls of having
// a script closetag in js inlined in html
var SCRIPT = 'script'
var SCRIPT_START = '<'+SCRIPT
var SCRIPT_END = '</'+SCRIPT+'>'

module.exports = transformHtml


function transformHtml(externalTags){

  var trumpet = Trumpet()

  trumpet.selectAll('head', function (node) {
    var readStream = node.createReadStream()
    var writeStream = node.createWriteStream()
    // insert external tags
    externalTags.forEach(function(tag){
      writeStream.write(SCRIPT_START+' src="'+tag+'">'+SCRIPT_END)
    })
    // append original content of head
    readStream.pipe(writeStream)
  })

  return trumpet

}

