let fetchRepoContribsUtil = require('./fetchRepoContribsUtil')
let storeAllContribsInDb = require('./storeAllContribsInDb')


function fetchAllContribsInDb(org) {
  return storeAllContribsInDb.storeAllContribsInDb(org)
  .then((response) => {
    return response;
  })
}


function repoContribsUtil(org, repo) {
  return fetchRepoContribsUtil.fetchRepoContributorsUtil(org, repo)
  .then((response) => {
    return response;
  })
}




// EXPORTS
module.exports = {
  repoContribsUtil: repoContribsUtil, 
  fetchAllContribsInDb: fetchAllContribsInDb
}

