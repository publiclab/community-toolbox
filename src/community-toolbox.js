CommunityToolbox = function CommunityToolbox(org, repo) {

  var SimpleApi = require("github-api-simple")

  var api = new SimpleApi();
  var ui = require('./ui');
  const requestP = require('request-promise');
  var parse = require('parse-link-header');

  var options = {
    'qs': {
      'sort': 'pushed',
      'direction': 'desc', // optional, GitHub API uses 'desc' by default for 'pushed'
      'per_page': 100
    }
  }

  // these are essentially examples for now; we could wrap them
  // in externally available methods for convenience but at the
  // moment they're not quite complex enough to merit it.

  function getIssuesForRepo(callback, _options) {
    _options = _options || options;
    api.Issues
       .getIssuesForRepo(org, repo, _options)
       .then(callback);
  }

  function getIssuesForOrg(_org, _options) {
    _options = _options || options;
    var _url = "https://api.github.com/search/issues?q=is%3Aopen+org%3A" + _org + "+label%3A" + _options.qs.labels;
    return requestP({ uri: _url });
  }

  function getCommitsForRepo(callback, _options) {
    _options = _options || options;
    api.Repositories
       .getRepoCommits(org, repo, _options)
       .then(callback);
  }

  function getRepoContributors(org, repo) {

    var getPages = api.Repositories
           .getRepoContributors(org, repo, {method: "HEAD", qs: { sort: 'pushed', direction: 'desc', per_page: 100 } })
           .then(function(contribData) {
             var headers = contribData;
             var parsed = parse(headers['link']);
             totalPages = parseInt(parsed.last.page);
             return totalPages;
           });

    //define totalContributors
    var totalContributors = 0;

    // get data given the page number
    function getData(curPage){
      api.Repositories
            .getRepoContributors(org, repo, { method:"GET", qs: { sort: 'pushed', direction: 'desc', per_page: 100, page:curPage } })
            .then(function(contributors) {
              var usernames = contributors.map(function(c) {
                return '<a href="https://github.com/' + c.login + '">@' + c.login + '</a>';
              });
              var avatars = contributors.map(function(c) {
                return '<a href="https://github.com/' + c.login + '"><img width="100px" src="' + c.avatar_url + '"></a>';
              });
              totalContributors += contributors.length;
              //push data to UI
              ui.insertContributors(totalContributors, usernames, avatars);
            });
    }

    var promises = [];
    getPages.then(function(totalPages){
      for(var i = 1; i <= totalPages; i++) {
        getData(i);
      }
    });

  }

  function displayIssuesForRepo(org, repo, label, selector) {
    toolbox.api.Issues
           .getIssuesForRepo(org, repo, { qs: { labels: label } })
           .then(function onGotIssues(issues) {
             issues.forEach(function(issue) {
               toolbox.ui.insertIssue(issue, selector);
             });
           });
  }

  var chart = require('./chart');

  // externally available API
  return {
    api:     api,
    ui:      ui,
    parse:   parse,
    chart:   chart,
    options: options,
    getIssuesForRepo: getIssuesForRepo,
    getIssuesForOrg: getIssuesForOrg,
    getCommitsForRepo: getCommitsForRepo,
    getRepoContributors: getRepoContributors,
    displayIssuesForRepo: displayIssuesForRepo
  }

}

module.exports = CommunityToolbox;
