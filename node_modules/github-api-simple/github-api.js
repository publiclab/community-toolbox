"use strict";

const path = require('path');
const extend = require('extend');
const requestP = require('request-promise');
const pkg = require('./package');

// Routes definition
const ROUTES = require('./assets/routes.json');

// Default configuration options
const DEFAULT_OPTIONS = {
	'baseUrl': 'https://api.github.com',
	'headers': {
		'User-Agent': 'github-api-simple v' + pkg.version + ' [nodejs] [https://github.com/MichielvdVelde/github-api-simple]'
	},
	'json': true
};

/**
 *
*/
let GithubService = function(options) {
	this._options = extend(true, DEFAULT_OPTIONS, options);

	let self = this;
	let buildMethod = function(namespace, route) {
		if(!GithubService.prototype[namespace])
			GithubService.prototype[namespace] = {};

		GithubService.prototype[namespace][route.method] = function() {
			let options = self._options;
			let argsRange = arguments.length;
			if(typeof arguments[arguments.length-1] == 'object') {
				argsRange = arguments.length-1;
				options = extend(true, options, arguments[arguments.length-1]);
			}
			options.uri = route.uri;
			let vars = Array.prototype.slice.call(arguments, 0, argsRange);
			for(let v of vars) {
				options.uri = options.uri.replace('%s', v);
			}
			return requestP(options);
		};
	};

	for(let namespace in ROUTES) {
		for(let route of ROUTES[namespace]) {
			buildMethod(namespace, route);
		}
	}
};

exports = module.exports = GithubService;
