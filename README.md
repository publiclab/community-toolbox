Community Toolbox
====

A toolbox of a GitHub organization's contributor community.

See a live instance (set up for Public Lab's community) at: http://code.publiclab.org/


## Embed an issues list

Community Toolbox lets you view issues of a specific repository for embedding on another site, with the following URL:

http://code.publiclab.org/examples/embed.html#o=orgname&r=repository

For issues with a specific label, use, for example: 

http://code.publiclab.org/examples/embed.html#o=orgname&r=repository&l=first-timers-only

To embed these on your site, use an `<iframe>` like this:

```html
<iframe src="http://code.publiclab.org/examples/embed.html#o=orgname&r=repository" style="border:none;" width="100%" height="600px"></iframe>
```

## Org-wide issues

You can also use Community Toolbox to display issues for a given label across an entire organization. Use `all` for the `r` parameter, like this:

http://code.publiclab.org/#r=all

## Repository specific issues
To find an issue in a specific repository, other than using the issues tab and the search bar, you can change the URL to filter through the issues! So if we look at the URL for embed.html:
https://publiclab.github.io/community-toolbox/examples/embed.html

To get to the issues of a specific repository, you can add a #r= then the name of the repository you want to looks through. For example, if you wanted to look through the issues in the plots2 repo, you would add #r=plots2 to the above URL. 

The default is #r=all. This will looks though all repositories and show only the first-timer-only issues in all the repositories. 
You can combine the above to search through specific issues in a specific repository. For example, you can add #r=all&l=help-wanted. The l= is where the name of the label on the issues you are looking for goes. Here's what that looks like in a full URL:
https://publiclab.github.io/community-toolbox/examples/embed.html#r=all&l=help-wanted

## Configuration

[These lines](https://github.com/publiclab/community-toolbox/blob/620c4d906be704ffaa5b40509796c18c393f83f4/index.html#L115-L118) allow configuration of the example to set **repository, organization** and **labels** to use, by adding to the URL hash in the format: `https://publiclab.github.io/community-toolbox/#r=all` (for the `r` parameter, as an example). So the options are:

* **repository** - using `r=` you can set the repository name to look at, like: http://code.publiclab.org#r=plots2 for https://github.com/publiclab/plots2
* **organization/user** - using `o=` you can set the organization or user name to look at, like: http://code.publiclab.org#o=publiclab for https://github.com/publiclab
* **first-timers-only label** - using `f=` you can set the label to use for `first-timers-only` or equivalent issues, like: http://code.publiclab.org#f=help-wanted for https://github.com/publiclab/plots2/labels/help-wanted
* **first timers only "candidates"** - using `c=` you can set the label to use for `fto-candidate` or equivalent issues (at Public Lab, we keep a queue of not-quite-ready-but-almost issues for newcomers, that have key information but aren't completely formatted to welcome yet), like: http://code.publiclab.org#c=fto-candidate for https://github.com/publiclab/plots2/labels/fto-candidate

## Developing

To develop and build out Community Toolbox, you'll need to have `npm` installed and to run `npm install` to get all the dependencies. 

Community Toolbox is built using a Grunt task from the source files in `/src/`, and the compiled file is saved to `/dist/community-toolbox.js`. To build, run `grunt build`. To watch files for changes, and build whenever they occur, run `grunt`. 

API calls are based on: https://www.npmjs.com/package/github-api-simple

## Install Instructions
* Clone or download the repo. into any fresh temporary folder.

   ``` git clone https://github.com/publiclab/community-toolbox.git ```

* Cd into that root folder you just cloned locally.

   ``` cd community-toolbox ```

* Open terminal in the current folder and to install all dependencies type

   ```npm install ```
   
   Update to new version of packages if required in package.json.
   
* Now go to the folder and open index.html in browser.


## Testing

To run tests, execute 

```
npm test
```
