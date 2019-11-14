const modelUtils = require('../../models/utils');

// Fetches all the publiclab's repositories
function getAllRepos (org) {
  // This array is used to store all the repositories fetched from Github
  const repos = [];

  // eslint-disable-next-line no-undef
  return fetch(
    `https://api.github.com/users/${org}/repos?sort=pushed&direction=desc&per_page=100`
  )
    .then(function gotRepos (data) {
      if (data.status === '200') {
        return data.json();
      } else {
        throw new Error("Couldn't fetch repositories :(");
      }
    })
    .then(function mapToEachRepo (results) {
      results.map(function mappingToEachRepo (repo, index) {
        return (repos[index] = repo.name);
      });
      return repos;
    })
    .then(repos => {
      // Storing the repos in the database
      modelUtils.setItem('repos', repos);
      return repos;
    })
    .catch(err => {
      throw err;
    });
}

// EXPORTS
module.exports.getAllRepos = getAllRepos;
