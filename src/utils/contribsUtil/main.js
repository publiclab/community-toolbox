let fetchRepoContribsUtil = require('./fetchRepoContribsUtil')
let storeAllContribsInDb = require('./storeAllContribsInDb')


function fetchAllContribsInDb(org) {
  return storeAllContribsInDb.storeAllContribsInDb(org)
  .then((response) => {
    return response;
  })
  .catch((err) => {
    console.log("err travelling through fetchAllContribsInDb");
    throw err;
  })
}


function repoContribsUtil(org, repo) {
  return fetchRepoContribsUtil.fetchRepoContributorsUtil(org, repo)
  .then((response) => {
    return response;
  })
  .catch((err) => {
    console.log("err travelling through repoContribsUtil");
    throw err;
  })
}




// EXPORTS
module.exports = {
  repoContribsUtil: repoContribsUtil, 
  fetchAllContribsInDb: fetchAllContribsInDb
}

