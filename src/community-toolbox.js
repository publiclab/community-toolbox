CommunityToolbox = function CommunityToolbox(org, repo) {

  var SimpleApi = require("github-api-simple")

  var api = new SimpleApi();
  var ui = require('./ui');

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

  function getIssuesForRepo(callback) {
    api.Issues
       .getIssuesForRepo(org, repo, options)
       .then(callback);
  }

  function getCommitsForRepo(callback) {
    api.Repositories
       .getRepoCommits(org, repo, options)
       .then(callback);
  }

  function getRepoContributors(callback) {
    api.Repositories
       .getRepoContributors(org, repo, options)
       .then(callback);
  }

  var chart = require('./chart');

  // externally available API
  return {
    api:     api,
    ui:      ui,
    chart:   chart,
    options: options
  }

}

module.exports = CommunityToolbox;
