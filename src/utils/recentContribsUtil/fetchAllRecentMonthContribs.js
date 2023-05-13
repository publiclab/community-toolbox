const modelUtils = require('../../models/utils');
const monthsQuery = require('./queryTime');
const fetchRecentMonthContribs = require('./fetchRecentMonthContribs');

// Fetches recent month commits for top 10 repositories
function fetchAllRecentMonthContribs (org, repos, queryTime) {
  const results = [];
  const commitersSet = new Set([]);
  const timeToday = (new Date()).getTime();
  const monthInd = monthsQuery.findMonthInd(queryTime);

  // We take only 10 repos just for API quota reasons
  const splicedRepos = repos.splice(0, 10);

  const promises = splicedRepos.map(function mapToEachRepo (repo, i) {
    return fetchRecentMonthContribs.fetchRecentMonthContribs(org, repo, queryTime)
      .then((response) => {
        if (response != null) {
          const partialResult = [];
          response.map(function mappingToCommits (commit, i) {
            if (commit.author != null) {
              if (!commitersSet.has(commit.author.login)) {
                commitersSet.add(commit.author.login);
                partialResult.push(commit);
                results.push(commit);
              }
            }
            return true;
          });

          // Save each repo's commits data to the database
          const currTime = (new Date()).getTime();
          modelUtils.setItem(`recent-${repo}-${monthInd}-month-commits`, partialResult);
          modelUtils.setItem(`recent-${repo}-${monthInd}-month-expiry`, currTime);
        }
      })
      .catch((err) => {
        throw err;
      });
  });

  return Promise.all(promises)
    .then(function promisesResolved () {
      // Store recentMonthCommits and recentMonthCommitsExpiry in the database
      modelUtils.setItem(`recent-all-${monthInd}-month-commits`, results);
      modelUtils.setItem(`recent-all-${monthInd}-month-expiry`, timeToday);
      return results;
    });
}

// EXPORTS
module.exports = {
  fetchAllRecentMonthContribs: fetchAllRecentMonthContribs
};
