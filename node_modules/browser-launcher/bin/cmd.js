#!/usr/bin/env node
var minimist = require('minimist');
var argv = minimist(process.argv.slice(2), {
    alias: { c: 'config' }
});

var config = require('../lib/config.js');
var cfile = argv.c || config.defaultConfigFile;

config.read(cfile, function (err, cfg, cdir) {
    console.log(JSON.stringify(cfg, null, 2));
});
