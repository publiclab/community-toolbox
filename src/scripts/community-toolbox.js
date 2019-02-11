CommunityToolbox = function CommunityToolbox(org, repo) {

  var SimpleApi = require("github-api-simple")
  var api = new SimpleApi();
  var ui = require('../UI/ui');
  var getAllContribsUtility = require('../utils/getAllContribsUtility');
  var repoContributorsUtility = require('../utils/repoContributorsUtility');
  var getRecentCommitsUtility = require('../utils/getRecentCommitsUtility');

  var model_utils = require('../models/utils');

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

  // This runs at the very start of page load and stores all the repos and all the
  // contributors in the database
  function storeAllContributorsInDatabase(org) {
    let AllContributors = [];
    let promises = [];
    var contributorSet = new Set([]);
    return new Promise((resolve, reject) => {
      model_utils.getItem('allContributors').then((allContributors) => {
        // If all contributors list is not in the database, it makes a fresh call to Github API
        if(allContributors == null || allContributors == undefined || allContributors.length == 0) {
          getAllContribsUtility.getAllRepos(org)
          .then(function gotRepos(res) {
            let splicedRepos = res.splice(0,20);
            splicedRepos.map(function mappingToEachRepo(Repo, i) {
              let promise =  repoContributorsUtility.fetchRepoContributorsUtil(org, Repo)
                            .then(function gotRepoContributorsInStorage(contributors) {
                              if(contributors!=undefined && contributors.length>0) {
                                contributors.map((contributor, i)=> {
                                  if(!contributorSet.has(contributor.login)) {
                                    contributorSet.add(contributor.login);
                                    AllContributors.push(contributor);
                                  }
                                })
                              }
                            });
              promises.push(promise);
            });
            return Promise.all(promises)
                    .then(()=> {
                        // Storing array containing all the contributors list across 20 most active
                        // repos to database
                        model_utils.setItem('allContributors', AllContributors);
                        // Saves current time in epoch, used for flushing out the stored data
                        // after 24 hours
                        let currentTime = (new Date).getTime();
                        model_utils.setItem('allContributorsExpiry', currentTime);
                        resolve(AllContributors);
                    })
          })
        }
        // If all contributors list is in the database, it simply returns that as a resolved promise 
        else {
          resolve(allContributors);
          console.log("allContributors already in database...");
        }
      })
    });
  }


  // This function is responsible for showing contributors
  // on a multi-repository view
  function getAllContributors(org) {
    return storeAllContributorsInDatabase(org).then((allContributors) => {
      // If the stored data is not undefined or null, execution goes here
      if(allContributors!=null && allContributors!=undefined && allContributors.length>0) {
        // Flushes contributors list from the database after every single day
        let timeNow = (new Date).getTime();
        model_utils.getItem('allContributorsExpiry')
        .then((allContributorsExpiry) => {
          if (allContributorsExpiry!=null && ((timeNow-allContributorsExpiry)/1000) >= 86400) {
            return Promise.all([model_utils.deleteItem('allContributors'), model_utils.deleteItem('allContributorsExpiry')])
              .then(()=> {
                return true;
              }) 
          }
        })
        .then(()=> {
          // Looking for contributors list in the database
          model_utils.getItem('allContributors').then((AllContributors) => {
            // If the data is not in the database, it gets fetched from storeAllContributorsInDatabase function
            if(AllContributors == null || AllContributors == undefined || AllContributors.length==0) {
  
              storeAllContributorsInDatabase(org).then(function gotAllContributors(AllContributors) {
                // Provides fetched contributors list to UI function for rendering it
                // to the user
                ui.insertContributors(AllContributors);
              })
            } 
            // If stored data is not null and undefined, process it
            else {
              ui.insertContributors(AllContributors);
            }
          })
        });
      }
      // If execution goes here, it means that there's probably something wrong 
      // in the storeAllContributorsInDatabase function
      else {
        console.log("Something went wrong while fetching all contributors :(");
      }
    })
  }


  // This function is responsible for showing all the contributors for a particular repository
  function showRepoContributors(org, repo) {
    return storeAllContributorsInDatabase(org).then((allContributors) => {
      // If the stored data is not undefined or null, execution goes here
      if(allContributors != null && allContributors!=undefined && allContributors.length>0) {
        // Flushes repoContributors from the database after every single day
        let timeNow = (new Date).getTime();
        model_utils.getItem(`${repo}Expiry`)
        .then((lifespan) => {
          if (lifespan!=null && ((timeNow-lifespan)/1000) >= 86400) {
            return Promise.all([model_utils.deleteItem(`${repo}`), model_utils.deleteItem(`${repo}Expiry`)])
              .then(()=>{
                return true;
              })
          }
        })
        .then(()=>{
          // Looking for repo Contributors list in the database
          model_utils.getItem(repo).then((repoContributors) => {
            // If we don't have repoContributors in the database, we fetch them from Github
            if (repoContributors == null || repoContributors == undefined) {
              repoContributorsUtility.fetchRepoContributorsUtil(org, repo)
              .then(function gotRepoContributorsInStorage (contributors) {
                ui.insertContributors(contributors);
                return;
              })
            }
            // If we have repoContributors in the database, we save a network call :)
            else {
              ui.insertContributors(repoContributors);
              return;
            }
          })
        })
      } else {
        // Execution goes here, it means that data for this repo is not available
        // in the database
        console.log(`Something went wrong while getting ${repo} contributors :(`);
      }
    })
  }

  // Stores all the Recent Contributors in the database
  function storeAllRecentContribsInitially(org, repo) {
    // We make queryTime 1 month behind the current time, to pass it as query in the request
    let d = (new Date);
    d.setDate(d.getDate() - 30);
    let queryTime = d.toISOString();
    let repos = JSON.parse(localStorage.getItem('repos'));
    return model_utils.getItem('recent-present').then((result)=> {
      if(result!=null && result!=undefined) {
        return result;
      }
      else {
        if(repos!=null || repos!=undefined) {
          return getRecentCommitsUtility.fetchAllRecentMonthCommits(org, repos, queryTime)
                  .then((result) => {
                    model_utils.setItem('recent-present', 'true');
                    return result;
                  })
        }
        else {
          getAllContribsUtility.getAllRepos(org).then((repos) => {
            if(repos!=null || repos!=undefined || repos.length>0) {
              return getRecentCommitsUtility.fetchAllRecentMonthCommits(org, repos, queryTime)
                      .then((result) => {
                        model_utils.setItem('recent-present', 'true');
                        return result;
                      })
            }
          });
        }
      }
    });
  }


  // Function for fetching and showing recent contributors
  function getRecentCommits(org, repo, recencyLabel) {
    return storeAllRecentContribsInitially(org, repo).then((result)=>{
      if(recencyLabel==='month') {
        return getRecentCommitsUtility.getCommitsLastMonth(org, repo)
              .then(function gotCommits(commits) {
                // Push data to UI
                ui.insertRecentContributors(commits);
                return;
              });
      } else {
        return getRecentCommitsUtility.getCommitsLastWeek(org, repo)
              .then((weekly_contribs) => {
                // Push data to UI
                ui.insertRecentContributors(weekly_contribs);
                return;
              });
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
    getRecentCommits: getRecentCommits,
    getCommitsForRepo: getCommitsForRepo,
    storeAllContributorsInDatabase: storeAllContributorsInDatabase,
    getAllContributors: getAllContributors,
    showRepoContributors: showRepoContributors,
    displayIssuesForRepo: displayIssuesForRepo
  }

}

module.exports = CommunityToolbox;
