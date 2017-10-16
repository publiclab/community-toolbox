Community Toolbox
====

A toolbox of a GitHub organization's contributor community.

Try at: http://jywarren.github.io/community-toolbox


## Developing

To develop and build out Community Toolbox, you'l need to have `npm` installed and to run `npm install` to get all the dependencies. 

Community Toolbox is built using a Grunt task from the source files in `/src/`, and the compiled file is saved to `/dist/community-toolbox.js`. To build, run `grunt build`. To watch files for changes, and build whenever they occur, run `grunt`. 

API calls are based on: https://www.npmjs.com/package/github-api-simple


## Testing

Assuming `tape` is installed via `npm install`:

`npm test`
