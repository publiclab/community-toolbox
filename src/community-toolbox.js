CommunityToolbox = function CommunityToolbox(org, repo) {

  var SimpleApi = require("github-api-simple")
  var api = new SimpleApi();
  var ui = require('./ui');
  var getAllContribsUtility = require('./getAllContribsUtility');
  var repoContributorsUtility = require('./repoContributorsUtility');
  var getRecentCommitsUtility = require('./getRecentCommitsUtility');

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

  // This function is responsible for showing contributors
  // on a multi-repository view
  function getAllContributors(org) {
    // This variable stores the total contributors count
    let totalContributors=0;

    // Flushes contributors lit from localStorage after every single day
    let timeNow = (new Date).getTime();
    let lifeTime = localStorage.getItem('date');
    if (lifeTime!=null && ((timeNow-lifeTime)/1000) >= 86400) {
      localStorage.removeItem('contributors');
      localStorage.removeItem('date');
    }

    // Looking for Repositories and Contributors list in localStorage
    let repos = JSON.parse(localStorage.getItem('repos'));
    let AllContributors = JSON.parse(localStorage.getItem('contributors'));

    // If contributors list is not present in localStorage, ================================================
    // fetch them from Github ==============================================================================
    if (AllContributors == null || AllContributors.length==0) {
      if(repos==null || repos.length==0) {
        // If repositories list is not present in localStorage,
        // fetch them from Github
        getAllContribsUtility.getAllRepos(org)
        .then(function gotRepos(res) {
          repos = res;
          // This function is responsible for getting contributors list FROM FIRST 30 REPOSITORIES
          getAllContribsUtility.getAllContributorsInStorage(org, repos)
          .then(function gotAllContributorsInStorage (contributors) {
            // Saves current time in epoch, used for flushing out the stored data
            // after 24 hours
            let currentTime = (new Date).getTime();
            localStorage.setItem('date', currentTime);

            // Map to contributors and store their usernames and avatar URLs to variables
            var usernames = contributors.map(function getContributorUsername(c) {
              return `@${c.login}`;
            });
            var avatars = contributors.map(function getContributorAvatarURL(c) {
              return '<img width="100px" src="' + c.avatar_url + '">';
            });
            document.getElementById("spinner-icon").style.visibility = "hidden";
            totalContributors += contributors.length;
            // Inject the data to UI
            ui.insertContributors(totalContributors, usernames, avatars);
            return;
          })
        })
      } else {
        // This function is responsible for getting contributors list FROM FIRST 30 REPOSITORIES
        getAllContribsUtility.getAllContributorsInStorage(org, repos)
        .then(function gotAllContributorsInStorage (contributors) {
          // Saves current time in epoch, used for flushing out the stored data
          // after 24 hours
          let currentTime = (new Date).getTime();
          localStorage.setItem('date', currentTime);

          // Map to contributors and store their usernames and avatar URLs to variables
          var usernames = contributors.map(function getContributorUsername(c) {
            return `@${c.login}`;
          });
          var avatars = contributors.map(function getContributorAvatarURL(c) {
            return '<img width="100px" src="' + c.avatar_url + '">';
          });
          document.getElementById("spinner-icon").style.visibility = "hidden";
          totalContributors += contributors.length;
          // Inject the data to UI
          ui.insertContributors(totalContributors, usernames, avatars);
          return;
        });
      }
    } 
    // If repos and contributors are already present in localStorage, ======================================
    // there is no need to hit the API =====================================================================
    else {
      // Map to contributors and store their usernames and avatar URLs to variables
      var usernames = AllContributors.map(function getContributorUsername(c) {
        return `@${c.login}`;
      });
      var avatars = AllContributors.map(function getContributorAvatarURL(c) {
        return '<img width="100px" src="' + c.avatar_url + '">';
      });
      document.getElementById("spinner-icon").style.visibility = "hidden";
      totalContributors += AllContributors.length;
      // Inject the data to UI
      ui.insertContributors(totalContributors, usernames, avatars);
      return;
    }
  }


  // This function is responsible for showing all the contributors for a particular repository
  function showRepoContributors(org, repo) {
    // This variable stores the total contributors count
    let totalContributors = 0;

     // Flushes repoContributors from localStorage after every single day
     let timeNow = (new Date).getTime();
     let lifespan = localStorage.getItem('repoContributorsExpiry');
     if (lifespan!=null && ((timeNow-lifespan)/1000) >= 43200) {
       localStorage.removeItem('repoContributors');
       localStorage.removeItem('repoContributorsExpiry');
     }
    
    // Looking for repo Contributors list in localStorage
    let repoContributors = JSON.parse(localStorage.getItem('repoContributors'));

    // If we don't have repoContributors in localStorage, we fetch them from Github
    if (repoContributors == null || repoContributors.length == 0) {
      repoContributorsUtility.fetchRepoContributors(org, repo)
      .then(function gotRepoContributorsInStorage (contributors) {
        // Map to contributors and store their usernames and avatar URLs to variables
        let usernames = contributors.map(function getRepoContributorUsername(c, i) {
          return '<a href="https://github.com/' + org + '/'+ repo +'/commits?author='+ c.login + '">@' + c.login + '</a>';
        });
        let avatars = contributors.map(function getRepoContributorAvatarURL(c, i) {
          return '<a href="https://github.com/' + org + '/'+ repo +'/commits?author='+ c.login + '"><img width="100px" src="' + c.avatar_url + '"></a>';
        });
        document.getElementById("spinner-icon").style.visibility = "hidden";
        totalContributors += contributors.length;
        //push data to UI
        ui.insertContributors(totalContributors, usernames, avatars);
        return;
      })
    }
    // If we have repoContributors in localStorage, we save a network call :)
    else {
      // Map to contributors and store their usernames and avatar URLs to variables
      let usernames = repoContributors.map(function getRepoContributorUsername(c, i) {
        return '<a href="https://github.com/' + org + '/'+ repo +'/commits?author='+ c.login + '">@' + c.login + '</a>';
      });
      let avatars = repoContributors.map(function getRepoContributorAvatarURL(c, i) {
        return '<a href="https://github.com/' + org + '/'+ repo +'/commits?author='+ c.login + '"><img width="100px" src="' + c.avatar_url + '"></a>';
      });
      document.getElementById("spinner-icon").style.visibility = "hidden";
      totalContributors += repoContributors.length;
      //push data to UI
      ui.insertContributors(totalContributors, usernames, avatars);
      return;
    }

  }

  function getRecentCommits(org) {
    var results = [];
    let repos = JSON.parse(localStorage.getItem('repos'));
    let recentCommitsExpiry = localStorage.getItem('recentCommitsExpiry');
    let timeToday = (new Date).getTime();
    // If recentCommits expiry time is 1 day behind the current time, flush them out.
    if(recentCommitsExpiry!=null && ((timeToday-recentCommitsExpiry)/1000)>=86400) {
      localStorage.removeItem('recentCommitsExpiry');
      localStorage.removeItem('recentCommits');
    }

    // We make queryTime 1 week behind the current time, to pass it as query in the request
    let queryTime = (new Date).toISOString();
    let temp = queryTime.split('T')[0].split('-')[2];
    queryTime = queryTime.replace(temp, temp-7);

    var recentCommits = JSON.parse(localStorage.getItem('recentCommits'));

    // There is no list of recentCommits in localStorage,
    // we need to get it from Github
    if(recentCommits==null || recentCommits.length==0) {
      if(repos==null || repos.length == 0) {
        getAllContribsUtility.getAllRepos(org)
        .then(function gotAllRepos(repos) {
          getRecentCommitsUtility.fetchRecentCommits(repos, queryTime)
          .then(function gotRecentCommitsInStorage(commits) {
            let totalCommits = commits.length;
            let usernames = commits.map((commit, i) => {
              return `@${commit.author.login}`;
            })
            let avatars = commits.map((commit, i) => {
              return '<img width="100px" src="' + commit.author.avatar_url + '">';
            })
            // Push data to UI
            ui.insertRecentContributors(totalCommits,usernames, avatars);
          })
        });
      } else  {
        // Repos are in the localStorage, we saved a network call!
        getRecentCommitsUtility.fetchRecentCommits(repos, queryTime)
        .then(function gotRecentCommitsInStorage(commits) {        
          let totalCommits = commits.length;
          let usernames = commits.map((commit, i) => {
            return `@${commit.author.login}`;
          })
          let avatars = commits.map((commit, i) => {
            return '<img width="100px" src="' + commit.author.avatar_url + '">';
          })
          // Push data to UI
          ui.insertRecentContributors(totalCommits,usernames, avatars);
        });
      }
    }else {
      // RecentCommits are in the localStorage, no need for any network call!!!
      let commits = JSON.parse(localStorage.getItem('recentCommits'));
      let totalCommits = commits.length;
      let usernames = commits.map((commit, i) => {
        return `@${commit.author.login}`;
      })
      let avatars = commits.map((commit, i) => {
        return '<img width="100px" src="' + commit.author.avatar_url + '">';
      })
      // Push data to UI
      ui.insertRecentContributors(totalCommits,usernames, avatars);
    }
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
    getRecentCommits: getRecentCommits,
    getCommitsForRepo: getCommitsForRepo,
    getAllContributors: getAllContributors,
    showRepoContributors: showRepoContributors,
    displayIssuesForRepo: displayIssuesForRepo
  }

}

module.exports = CommunityToolbox;
