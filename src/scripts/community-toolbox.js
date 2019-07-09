
CommunityToolbox = function CommunityToolbox(org, repo) {
  
  
  var SimpleApi = require('github-api-simple')
  var api = new SimpleApi();
  
  var crud = require('../models/crud')
  var issuesUI = require('../UI/issuesUI')
  var model_utils = require('../models/utils')
  var fetchReposUtil = require('../utils/fetchRepoUtil')
  var contributorsUI = require('../UI/contributorsUI')
  var contributorsUtil = require('../utils/contributorsUtil')
  var recentContributorsUI = require('../UI/recentContributorsUI')
  var recentContribsUtil = require('../utils/recentContribsUtil')
  var autoCompleteUtil = require('../utils/autocomplete')
  var ftoAuthorsUI = require('../UI/ftoAuthorsUI')
  var issuesUtil = require('../utils/staleIssuesUtil')

  const requestP = require('request-promise')
  var parse = require('parse-link-header')
  var chart = require('./chart');
  
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


  function initialize(org, repo) {
      return new Promise((resolve, reject) => {
        return crud.populateDb()
          .then((res) => {
            return true;
          })
          .then((dummy) => {
            return model_utils.getItem('repos').then((response) => {
              if(response==null || response==undefined) {
                // Fetches and stores the list of repositories when the page loads
                return fetchReposUtil.getAllRepos(org)
                  .then((resp) => {
                      resolve(true);
                  });
              }
              resolve(true);
            });
          });
      });
    }


  function dropdownInit() {
    return model_utils.getItem('repos').then((res) => {
      if(res!=null && res!=undefined) {
        autoCompleteUtil.generateAutocomplete(res);
      }else {
        console.log("not working");
      }
    });
  }


  // This function is responsible for showing contributors
  // on a multi-repository view
  function showAllContributors(org) {
    return contributorsUtil.storeAllContributorsInDatabase(org).then((allContributors) => {
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
  
                contributorsUtil.storeAllContributorsInDatabase(org).then(function gotAllContributors(AllContributors) {
                // Provides fetched contributors list to UI function for rendering it
                // to the user
                contributorsUI.insertContributors(AllContributors);
              })
            } 
            // If stored data is not null and undefined, process it
            else {
              contributorsUI.insertContributors(AllContributors);
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
    return contributorsUtil.storeAllContributorsInDatabase(org).then((allContributors) => {
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
              contributorsUtil.fetchRepoContributorsUtil(org, repo)
              .then(function gotRepoContributorsInStorage (contributors) {
                contributorsUI.insertContributors(contributors);
                return;
              })
            }
            // If we have repoContributors in the database, we save a network call :)
            else {
              contributorsUI.insertContributors(repoContributors);
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


  // Function for fetching and showing recent contributors
  function showRecentContributors(org, repo, recencyLabel) {
    return contributorsUtil.storeAllRecentContribsInitially(org, repo).then((result)=>{
      if(recencyLabel==='month') {
        return recentContribsUtil.getCommitsLastMonth(org, repo)
              .then(function gotCommits(commits) {
                // Push data to UI
                recentContributorsUI.insertRecentContributors(commits);
                return;
              });
      } else {
        return recentContribsUtil.getCommitsLastWeek(org, repo)
              .then((weekly_contribs) => {
                // Push data to UI
                recentContributorsUI.insertRecentContributors(weekly_contribs);
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
               toolbox.issuesUI.insertIssue(issue, selector);
             });
           });
  }


  function showStaleIssues(org, repo) {
    return issuesUtil.getStaleIssues(org, repo).then((data)=>{
      if(data!=null && data!=undefined) {
        issuesUI.insertStale(data, '.stale');
      }
    })
  }




  // externally available API
  return {
    api:     api,
    issuesUI:   issuesUI,
    contributorsUI: contributorsUI,
    recentContributorsUI: recentContributorsUI,
    parse:   parse,
    chart:   chart,
    options: options,
    getIssuesForRepo: getIssuesForRepo,
    getIssuesForOrg: getIssuesForOrg,
    showRecentContributors: showRecentContributors,
    getCommitsForRepo: getCommitsForRepo,
    showAllContributors: showAllContributors,
    showRepoContributors: showRepoContributors,
    displayIssuesForRepo: displayIssuesForRepo,
    initialize: initialize,
    dropdownInit: dropdownInit,
    ftoAuthorsUI: ftoAuthorsUI,
    showStaleIssues: showStaleIssues
  }

}

module.exports = CommunityToolbox;
