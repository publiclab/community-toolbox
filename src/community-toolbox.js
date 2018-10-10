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

  function fetchRepoContributors(org, repo) {
    var arr = [];
    return api.Repositories
    .getRepoContributors(org, repo, {method: "HEAD", qs: { sort: 'pushed', direction: 'desc', per_page: 100 } })
    .then((contribData) => {
      var headers = contribData;
      if (headers.hasOwnProperty("link")) {
          var parsed = parse(headers['link']);
          var totalPages = parseInt(parsed.last.page);
      } else {
          var totalPages = 1;
      }
      return totalPages;
    })
    .then((totalPages) => {
      let promises = [];
      for(let i = 1; i <= totalPages; i++) {

        var currentPromise = api.Repositories
                              .getRepoContributors(org, repo, { method:"GET", qs: { sort: 'pushed', direction: 'desc', per_page: 100, page:i } })
                              .then(function(contributors) {
                                if (contributors!=undefined && (contributors != null || contributors.length > 0)) {
                                    contributors.map((contributor, i) => arr.push(contributor));
                                }
                              });
        promises.push(currentPromise);
      }
      return Promise.all(promises)
            .then(()=> {
              return arr;
            });
    })
  }



  // Fetches all the publiclab repos
  function getAllRepos(org) {
    let repos = [];
    return new Promise((resolve, reject) => {
      fetch(`https://api.github.com/orgs/${org}/repos`, {'headers': { "Content-Type": "application/x-www-form-urlencoded", "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36" }})
      .then((response) => {
        if (response.status == "200") {
          return response.json();
        }
      })
      .then((res) => {
        res.map((item, i) => {
          repos[i] = item.name;
        });
        // Stores all public lab repos to localstorage (only first 30 repos yet)
        localStorage.setItem('repos', JSON.stringify(repos));

        resolve(repos);
      })
    });
    
  }

  // Fetches all the UNIQUE contributors from all the publiclab repos
  // and stores them in localstorage in the form of array
  function getAllContributorsInStorage(org, repos) {
    var contributorSet = new Set([]);
    var myArr = [];

    var promises = repos.map((repo, i) => {
                    return fetchRepoContributors(org, repo)
                      .then((repoContributors) => {
                        if (repoContributors!=undefined && repoContributors.length>0) {
                          repoContributors.map((contributor, i) => {
                            if(!contributorSet.has(contributor.login)) {
                              contributorSet.add(contributor.login);
                              myArr.push(contributor);
                            }
                          });
                        }
                        return(true);
                      });
                  });

      return Promise.all(promises)
        .then(() => {
          // Stores all unique contributors info to localstorage
          localStorage.setItem('contributors', JSON.stringify(myArr));
          return myArr;
        });


  }

  function getAllContributors(org) {
    let totalContributors=0;

    // Flushes contributors from localStorage after every single day
    let timeNow = (new Date).getTime();
    let lifeTime = localStorage.getItem('date');
    if (lifeTime!=null && ((timeNow-lifeTime)/1000) >= 86400) {
      localStorage.removeItem('contributors');
      localStorage.removeItem('date');
    }

    let repos = JSON.parse(localStorage.getItem('repos'));
    let AllContributors = JSON.parse(localStorage.getItem('contributors'));

    if (AllContributors == null || AllContributors.length==0) {
      if(repos==null || repos.length==0) {
        getAllRepos(org).then((res)=> {
          repos = res;
          getAllContributorsInStorage(org, repos).then((contributors) => {
            let currentTime = (new Date).getTime();
            localStorage.setItem('date', currentTime);
            var usernames = contributors.map(function(c) {
              return `@${c.login}`;
            });
            var avatars = contributors.map(function(c) {
              return '<img width="100px" src="' + c.avatar_url + '">';
            });
            totalContributors += contributors.length;
            ui.insertContributors(totalContributors, usernames, avatars);
            return;
          })
        })
      } else {
        getAllContributorsInStorage(org, repos).then((contributors) => {
          let currentTime = (new Date).getTime();
          localStorage.setItem('date', currentTime);
          var usernames = contributors.map(function(c) {
            return `@${c.login}`;
          });
          var avatars = contributors.map(function(c) {
            return '<img width="100px" src="' + c.avatar_url + '">';
          });
          totalContributors += contributors.length;
          ui.insertContributors(totalContributors, usernames, avatars);
          return;
        })
      }
    } else {   
      // If Repos and contributors are already present in localstorage, then
      // there is no need to hit the API =====================================================================
      var usernames = AllContributors.map(function(c) {
        return `@${c.login}`;
      });
      var avatars = AllContributors.map(function(c) {
        return '<img width="100px" src="' + c.avatar_url + '">';
      });
      totalContributors += AllContributors.length;
      ui.insertContributors(totalContributors, usernames, avatars);
      return;
    }
  }

  function getRepoContributors(org, repo) {
    let contributorsArray = [];

    return api.Repositories
           .getRepoContributors(org, repo, {method: "HEAD", qs: { sort: 'pushed', direction: 'desc', per_page: 100 } })
           .then((contribData) => {
             var headers = contribData;
             if (headers.hasOwnProperty("link")) {
                 var parsed = parse(headers['link']);
                 totalPages = parseInt(parsed.last.page);
             } else {
                 totalPages = 1;
             }
             return totalPages;
           })
           .then((totalPages) => {
              let promises = [];
              for(let i = 1; i <= totalPages; i++) {
                var currentPromise = api.Repositories
                                      .getRepoContributors(org, repo, { method:"GET", qs: { sort: 'pushed', direction: 'desc', per_page: 100, page:i } })
                                      .then((contributors) => {
                                        if (contributors!=undefined && (contributors != null || contributors.length > 0)) {
                                            contributors.map((contributor, i) => contributorsArray.push(contributor));
                                        }
                                      });
                promises.push(currentPromise);
              }
              return Promise.all(promises)
                    .then(()=> {
                      let now = (new Date).getTime();
                      localStorage.setItem('repoContributors', JSON.stringify(contributorsArray));
                      localStorage.setItem('repoContributorsExpiry', now);
                      return contributorsArray;
                    });
           });
  }

  function showRepoContributors(org, repo) {
    let totalContributors = 0;

     // Flushes repoContributors from localStorage after every single day
     let timeNow = (new Date).getTime();
     let lifespan = localStorage.getItem('repoContributorsExpiry');
     if (lifespan!=null && ((timeNow-lifespan)/1000) >= 43200) {
       localStorage.removeItem('repoContributors');
       localStorage.removeItem('repoContributorsExpiry');
     }
    let repoContributors = JSON.parse(localStorage.getItem('repoContributors'));

    // If we don't have repoContributors in localStorage, we fetch them from Github
    if (repoContributors == null || repoContributors.length == 0) {
      getRepoContributors(org, repo).then((contributors) => {
        let usernames = contributors.map((c, i) => {
          return '<a href="https://github.com/' + org + '/'+ repo +'/commits?author='+ c.login + '">@' + c.login + '</a>';
        });
        let avatars = contributors.map((c, i) => {
          return '<a href="https://github.com/' + org + '/'+ repo +'/commits?author='+ c.login + '"><img width="100px" src="' + c.avatar_url + '"></a>';
        });
        totalContributors += contributors.length;
        //push data to UI
        ui.insertContributors(totalContributors, usernames, avatars);
      })
    } 
    // If we have repoContributors in localStorage, we save a network call :)
    else {
      let usernames = repoContributors.map((c, i) => {
        return '<a href="https://github.com/' + org + '/'+ repo +'/commits?author='+ c.login + '">@' + c.login + '</a>';
      });
      let avatars = repoContributors.map((c, i) => {
        return '<a href="https://github.com/' + org + '/'+ repo +'/commits?author='+ c.login + '"><img width="100px" src="' + c.avatar_url + '"></a>';
      });
      totalContributors += repoContributors.length;
      //push data to UI
      ui.insertContributors(totalContributors, usernames, avatars);
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
    getCommitsForRepo: getCommitsForRepo,
    getAllContributors: getAllContributors,
    showRepoContributors: showRepoContributors,
    displayIssuesForRepo: displayIssuesForRepo
  }

}

module.exports = CommunityToolbox;
