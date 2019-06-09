
var SimpleApi = require("github-api-simple")
var api = new SimpleApi()
var parse = require('parse-link-header')
var model_utils = require('../models/utils')
var fetchRepoUtil = require('./fetchRepoUtil')
var recentContribsUtil = require('../utils/recentContribsUtil')

// This is a utility function which decides whether to make a single request for fetching
// each repository's contributors or multiple ones.
function fetchRepoContributorsUtil(org, repo) {
  return new Promise((resolve, reject) => {
    if(repo === 'plots2') {
      resolve(fetchAllRepoContributors(org, repo));
    }else {
      resolve(fetchRepoContributors(org, repo));
    }
  })
}


// This utility helps us in getting CONTRIBUTORS for a particular repository
function fetchRepoContributors(org, repo) {
  // This array is used to store the contributors from all of the repositories
  let contributorsArray = [];

  return api.Repositories
            .getRepoContributors(org, repo, { method:"GET", qs: { sort: 'pushed', direction: 'desc', per_page: 100 }})
            .then(function gotRepoContributors(contributors) {
              if (contributors!=undefined && (contributors != null || contributors.length > 0)) {
                contributors.map((contributor, i) => contributorsArray.push(contributor));
              }
            })
            .then(() => {
              let now = (new Date).getTime();
              model_utils.setItem(repo, contributorsArray);
              model_utils.setItem(`${repo}Expiry`, now);
              return contributorsArray;
            })
}




// This utility helps us in getting all the contributors for a particular repository
function fetchAllRepoContributors(org, repo) {
    // This array is used to store the contributors from all of the repositories
    let contributorsArray = [];

    return api.Repositories
           .getRepoContributors(org, repo, {method: "HEAD", qs: { sort: 'pushed', direction: 'desc', per_page: 100 } })
           .then(function gotContribData(contribData) {
             var headers = contribData;
             if (headers.hasOwnProperty("link")) {
                var parsed = parse(headers['link']);
                if(parsed.last.page!=undefined) {
                  totalPages = parseInt(parsed.last.page);
                }
             } else {
                 totalPages = 1;
             }
             return totalPages;
           })
           .then(function gotTotalPages(totalPages) {
              // This array is used to store all of the promises
              let promises = [];

              for(let i = 1; i <= totalPages; i++) {
                var currentPromise = api.Repositories
                                      .getRepoContributors(org, repo, { method:"GET", qs: { sort: 'pushed', direction: 'desc', per_page: 100, page:i } })
                                      .then(function gotRepoContributors(contributors) {
                                        if (contributors!=undefined && (contributors != null || contributors.length > 0)) {
                                            contributors.map((contributor, i) => contributorsArray.push(contributor));
                                        }
                                      });
                // Push currentPromise to promises array
                promises.push(currentPromise);
              }

              // Waits for all of the promises to resolve first, sets localStorage after that...
              return Promise.all(promises)
                    .then(()=> {
                      let now = (new Date).getTime();
                      model_utils.setItem(repo, contributorsArray);
                      model_utils.setItem(`${repo}Expiry`, now);
                      return contributorsArray;
                    });
           });
}


// This runs at the very start of page load and stores all the repositories and all the
// contributors in the database on initial page load
function storeAllContributorsInDatabase(org) {
  let AllContributors = [];
  let promises = [];
  var contributorSet = new Set([]);
  return new Promise((resolve, reject) => {
      model_utils.getItem('allContributors').then((allContributors) => {
        // If all contributors list is not in the database, it makes a fresh call to Github API
        if(allContributors == null || allContributors == undefined || allContributors.length == 0) {
            return model_utils.getItem('repos').then((res) => {
              let splicedRepos = res.splice(0,20);
              splicedRepos.map(function mappingToEachRepo(Repo, i) {
                let promise =  fetchRepoContributorsUtil(org, Repo)
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
                          // Storing array containing all the contributors' list across 20 most active
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
        }
      })
    });
}


// Stores all the Recent Contributors in the database
function storeAllRecentContribsInitially(org, repo) {
  // We make queryTime 1 month behind the current time, to pass it as query in the request
  let d = (new Date);
  d.setDate(d.getDate() - 30);
  let queryTime = d.toISOString();
  return model_utils.getItem('repos').then((repos) => {
      return model_utils.getItem('recent-present').then((result)=> {
        if(result!=null && result!=undefined) {
          return result;
        }
        else {
          if(repos!=null || repos!=undefined) {
            return recentContribsUtil.fetchAllRecentMonthCommits(org, repos, queryTime)
                    .then((result) => {
                      model_utils.setItem('recent-present', 'true');
                        return result;
                    })
          } else {
            fetchRepoUtil.getAllRepos(org).then((repos) => {
              if(repos!=null || repos!=undefined) {
                return recentContribsUtil.fetchAllRecentMonthCommits(org, repos, queryTime)
                        .then((result) => {
                          model_utils.setItem('recent-present', 'true');
                          return result;
                        })
              }
            });
          }
        }
      });
  })
  
}



// EXPORTS
module.exports = {
  fetchAllRepoContributors: fetchAllRepoContributors,
  fetchRepoContributors: fetchRepoContributors,
  fetchRepoContributorsUtil: fetchRepoContributorsUtil,
  storeAllRecentContribsInitially: storeAllRecentContribsInitially,
  storeAllContributorsInDatabase: storeAllContributorsInDatabase,
}

