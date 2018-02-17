Community Toolbox
====

A toolbox of a GitHub organization's contributor community.

Try at: http://publiclab.github.io/community-toolbox


## Embed an issues list

Community Toolbox lets you view issues of a specific repository for embedding on another site, with the following URL:

https://publiclab.github.io/community-toolbox/examples/embed.html#o=orgname&r=repository

For issues with a specific label, use, for example: 

https://publiclab.github.io/community-toolbox/examples/embed.html#o=orgname&r=repository&l=first-timers-only

To embed these on your site, use an `<iframe>` like this:

```html
<iframe src="https://publiclab.github.io/community-toolbox/examples/embed.html#o=orgname&r=repository" style="border:none;" width="100%" height="600px"></iframe>
```

## Org-wide issues

You can also use Community Toolbox to display issues for a given label across an entire organization. Use `all` for the `r` parameter, like this:

https://publiclab.github.io/community-toolbox/#r=all

## Configuration

[These lines](https://github.com/publiclab/community-toolbox/blob/620c4d906be704ffaa5b40509796c18c393f83f4/index.html#L115-L118) allow configuration of the example to set **repository, organization** and **labels** to use, by adding to the URL hash in the format: `https://publiclab.github.io/community-toolbox/#r=all` (for the `r` parameter, as an example). So the options are:

* **repository** - using `r=` you can set the repository name to look at, like: https://publiclab.github.io/community-toolbox/#r=plots2 for https://github.com/publiclab/plots2
* **organization/user** - using `o=` you can set the organization or user name to look at, like: https://publiclab.github.io/community-toolbox/#o=publiclab for https://github.com/publiclab
* **first-timers-only label** - using `f=` you can set the label to use for `first-timers-only` or equivalent issues, like: https://publiclab.github.io/community-toolbox/#f=help-wanted for https://github.com/publiclab/plots2/labels/help-wanted
* **first timers only "candidates"** - using `c=` you can set the label to use for `fto-candidate` or equivalent issues (at Public Lab, we keep a queue of not-quite-ready-but-almost issues for newcomers, that have key information but aren't completely formatted to welcome yet), like: https://publiclab.github.io/community-toolbox/#c=fto-candidate for https://github.com/publiclab/plots2/labels/fto-candidate


## Developing

To develop and build out Community Toolbox, you'l need to have `npm` installed and to run `npm install` to get all the dependencies. 

Community Toolbox is built using a Grunt task from the source files in `/src/`, and the compiled file is saved to `/dist/community-toolbox.js`. To build, run `grunt build`. To watch files for changes, and build whenever they occur, run `grunt`. 

API calls are based on: https://www.npmjs.com/package/github-api-simple


## Testing

(testing is not yet implemented, but when it is, it'll probably work like this)

Assuming `tape` is installed via `npm install`:

`npm test`
