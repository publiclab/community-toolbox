CommunityPortrait = function CommunityPortrait(org, repo) {

  var SimpleApi = require("github-api-simple")

  var api = new SimpleApi();



  api.Issues.getIssuesForRepo(org, repo)
    .then(function(issues) {
      console.log('This repo has %d issues', issues.length);
      // display
      $('.output').html(JSON.stringify(issues));
    });



  return {
    api: api
  }

}

module.exports = CommunityPortrait;
