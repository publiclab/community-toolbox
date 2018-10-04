#!/usr/bin/env node

var htmlInject = require('./')

// omit the first 2 arguments ('node', 'path')
argv = process.argv.slice(2)

// no args - fail
if (!argv.length) {
	console.log('No input arguments specified...')
  printUsage()
	process.exit(1)
// help
} else if (argv.length == 1 && argv[0] == '-h') {
	printUsage()
// stdin -> transform -> stdout
} else {
  process.stdin
  .pipe(htmlInject(argv))
  .pipe(process.stdout)
}

function printUsage() {
  console.log('usage: cat index.html | htmlinjectscript "app.js" > output.html')
}