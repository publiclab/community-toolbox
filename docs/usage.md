How to use
====

Take a look below for some of the ways you can use Community Toolbox,

## Embed an issues list

Community Toolbox lets you view issues of a specific repository for embedding on another site, with the following URL:

```
https://code.publiclab.org/examples/embed.html#o=orgname&r=repository
```

For issues with a specific label, use, for example: 

```
https://code.publiclab.org/examples/embed.html#o=orgname&r=repository&f=first-timers-only
```

To embed these on your site, use an `<iframe>` like this:

```html
<iframe src="https://code.publiclab.org/examples/embed.html#o=orgname&r=repository" style="border:none;" width="100%" height="600px"></iframe>
```

For more options, see **Configuration** below.

## Org-wide issues

You can also use Community Toolbox to display issues for a given label across an entire organization. Use `all` for the `r` parameter to get the view of all repositories' data, like this:

```
https://code.publiclab.org/#r=all
```

## Repository specific issues
To find an issue in a specific repository, other than using the issues tab and the search bar, you can change the URL to filter through the issues! So if we look at the URL for embed.html:

```
https://code.publiclab.org/examples/embed.html
```

To get to the issues of a specific repository, you can add a #r= then the name of the repository you want to look through. For example, if you wanted to look through the issues in the plots2 repo, you would add #r=plots2 to the above URL. 

The default is #r=all. This will look though all repositories and show only the first-timer-only issues in all the repositories. 
You can combine the above to search through specific issues in a specific repository. For example, you can add #r=all&l=help-wanted. The l= is where the name of the label on the issues you are looking for goes. Here's what that looks like in a full URL:

```
https://code.publiclab.org/examples/embed.html#r=all&l=help-wanted
```

## Configuration

[These lines](https://github.com/publiclab/community-toolbox/blob/620c4d906be704ffaa5b40509796c18c393f83f4/index.html#L115-L118) allow configuration of the example to set **repository, organization** and **labels** to use, by adding to the URL hash in the format: `https://publiclab.github.io/community-toolbox/#r=all` (for the `r` parameter, as an example). So the options are:

https://code.publiclab.org/ is run from our GitHub Pages system, so it's equivalent to https://publiclab.github.io/community-toolbox/

- **repository:** Using `r=` you can set the repository name to look at, like: http://code.publiclab.org#r=plots2 for https://github.com/publiclab/plots2
- **organization/user:** Using `o=` you can set the organization or user name to look at, like: http://code.publiclab.org#o=publiclab for https://github.com/publiclab
- **first-timers-only label:** Using `f=` you can set the label to use for `first-timers-only` or equivalent issues, like: http://code.publiclab.org#f=help-wanted for https://github.com/publiclab/plots2/labels/help-wanted
- **first timers only "candidates":** Using `c=` you can set the label to use for `fto-candidate` or equivalent issues (at Public Lab, we keep a queue of not-quite-ready-but-almost issues for newcomers, that have key information but aren't completely formatted to welcome yet), like: http://code.publiclab.org#c=fto-candidate for https://github.com/publiclab/plots2/labels/fto-candidate
