Community Portrait
====

A portrait of a GitHub organization's contributor community.

Try at: http://jywarren.github.io/community-portrait


## Developing

To develop and build out Community Portrait, you'l need to have `npm` installed and to run `npm install` to get all the dependencies. 

Community Portrait is built using a Grunt task from the source files in `/src/`, and the compiled file is saved to `/dist/community-portrait.js`. To build, run `grunt build`. To watch files for changes, and build whenever they occur, run `grunt`. 


## Testing

Assuming `tape` is installed via `npm install`:

`npm test`
