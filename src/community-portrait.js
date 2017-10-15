CommunityPortrait = function CommunityPortrait(org, repo) {

  var SimpleApi = require("github-api-simple")

  var api = new SimpleApi();

  var options = {
    'qs': {
      'sort': 'pushed',
      'direction': 'desc', // optional, GitHub API uses 'desc' by default for 'pushed' 
      'per_page': 100
    }
  }

  function getIssuesForRepo() {
    api.Issues.getIssuesForRepo(org, repo, options)
      .then(function(issues) {
        console.log('This repo has %d issues', issues.length);
        // display
        $('.output').val(JSON.stringify(issues));
      });
  }

  function getCommitsForRepo() {
    api.Repositories.getRepoCommits(org, repo, options)
      .then(function(commits) {
        console.log(commits)
      });
  }

  api.Repositories.getRepoContributors(org, repo, options)
    .then(function(contributors) {
        console.log('This repo has %d contributors', contributors.length);
        var usernames = contributors.map(function(c) { return '@' + c.login });
        $('.output').val(usernames.join(', '));
    });

  var chart = require('./chart');

  //var graphContributorsByIssue = require('./graphContributorsByPR');

  getCommitsForRepo()

  return {
    api: api,
    chart: chart
  }

}

module.exports = CommunityPortrait;
