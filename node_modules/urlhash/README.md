# urlhash
A simple library for reading and writing parameters to the URL hash.


## Installation

You can install with `npm install urlhash` and include with `var urlHash = require('urlhash')`.

For basic use in the browser, you can simply include `urlHash.js` and use `urlHash().getUrlHashParameter(param)` as below.


## Usage

`urlHash.getUrlHashParameter(param)`

returns the value of the named url hash parameter, so `bar` from `example.com#foo=bar`

`urlHash.getUrlHashParameters()`

returns all url hash parameters in an object, so `{foo: 'bar', bibim: 'bap'}` from `example.com#foo=bar&bibim=bap`

`urlHash.setUrlHashParameter(param, value)`

sets the value of the named url hash parameter, so `example.com#foo=bar` from `setUrlHashParameter('foo', 'bar')`

`urlHash.setUrlHashParameters(params)`

sets all url hash parameters in a passed object, so `example.com#foo=bar&bibim=bap` from `{foo: 'bar', bibim: 'bap'}`
