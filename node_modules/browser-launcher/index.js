var config = require('./lib/config');
var detect = require('./lib/detect');
var run = require('./lib/run');
var createProfiles = require('./lib/create_profiles');
var extend = require('xtend');

var path = require('path');
var spawn = require('child_process').spawn;

exports = module.exports = function (opts, cb) {
    if (typeof opts === 'function') {
        cb = opts;
        opts = {};
    }
    if (!opts) opts = {};
    
    config.read(opts.config, function (err, cfg, configDir) {
        if (!cfg) {
            exports.setup(configDir, function (err, cfg) {
                if (err) cb(err)
                else cb(null, wrap(cfg))
            });
        }
        else cb(null, wrap(extend(cfg, {isStale: true, configDir: configDir})))
    });
    
    function wrap (cfg) {
        var res = launcher.bind(null, cfg);
        res.browsers = cfg.browsers;
        return res;
    }
};
exports.detect = detect;
exports.config = config;

exports.setup = function (configDir, cb) {
    if (typeof configDir === 'function') {
        cb = configDir;
        configDir = path.dirname(config.defaultConfigFile);
    }
    detect(function (avail) {
        createProfiles(avail, configDir, function (err) {
            if (err) return cb(err);
            var cfg = { browsers : { local : avail } };
            config.write(cfg, function (err) {
                if (err) cb(err)
                else cb(null, cfg)
            });
        })
    });
};

function launcher (cfg, uri, opts, cb) {
    if (typeof opts === 'string') {
        opts = { browser : opts };
    }
    if (!opts) opts = {};
    
    function runRunner (runCfg, noRunner) {
        var version = opts.version || opts.browser.split('/')[1] || '*';
        var name = opts.browser.split('/')[0];
        var runner = run(runCfg, name, version) || 'no matches for ' + name + '/' + version;
        if (typeof runner === 'function') runner(uri, opts, cb)
        else noRunner(runner)
    }
    
    var isStale = cfg.isStale;
    var configDir = cfg.configDir;
    
    runRunner(cfg, function (err) {
        if (isStale && configDir) {
            exports.setup(configDir, function (setupErr, refreshedCfg) {
                if (setupErr) cb(setupErr)
                else runRunner(refreshedCfg, cb)
            });
        }
        else cb(err)
    });
}
