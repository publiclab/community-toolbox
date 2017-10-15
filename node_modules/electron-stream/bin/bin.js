#!/usr/bin/env node

var electron = require('..');
var minimist = require('minimist');

var argv = minimist(process.argv.slice(2), {
  boolean: 'node',
  alias: {
    nodeIntegration: 'node',
    'node-integration': 'node'
  }
});
var browser = electron(argv);

process.stdin.pipe(browser);
browser.stdout.pipe(process.stdout);
browser.stderr.pipe(process.stderr);

