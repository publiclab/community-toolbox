const fetchAllRepoContribs = require('./fetchAllRepoContribs');
const fetchRepoContribs = require('./fetchRepoContribs');

// This is a utility function which decides whether to make a single request for fetching
// each repository's contributors or multiple ones.
function fetchRepoContributorsUtil (org, repo) {
  return new Promise((resolve, reject) => {
    if (repo === 'plots2') {
      resolve(fetchAllRepoContribs.fetchAllRepoContribs(org, repo));
    } else {
      resolve(fetchRepoContribs.fetchRepoContribs(org, repo));
    }
  });
}

// EXPORTS
module.exports = {
  fetchRepoContributorsUtil: fetchRepoContributorsUtil
};
