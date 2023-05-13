const modelUtils = require('../../models/utils');
const monthsQuery = require('./queryTime');

function freshFetch (org, repo, queryTime) {
  const result = [];
  const proms = [];
  const monthsInd = monthsQuery.findMonthInd(queryTime);

  for (let i = 0; i < 2; i++) {
    proms.push(
      // eslint-disable-next-line no-undef
      fetch(
        `https://api.github.com/repos/${org}/${repo}/commits?since=${queryTime}&per_page=100&page=${i}`
      )
        .then(function gotResponse (response) {
          // eslint-disable-next-line eqeqeq
          if (response.status == '200') {
            return response.json();
          } else {
            throw new Error(`Couldn't fetch commits for ${repo}`);
          }
        })
        .then(function gotResponseJson (response) {
          if (response != null) {
            response.map(function mappingToCommits (commit, i) {
              result.push(commit);
            });
          }
          return result;
        })
    );
  }

  return Promise.all(proms).then(() => {
    // Save each repo's commits data to the database
    const currTime = new Date().getTime();
    modelUtils.setItem(`recent-${repo}-${monthsInd}-month-commits`, result);
    modelUtils.setItem(`recent-${repo}-${monthsInd}-month-expiry`, currTime);
    return result;
  });
}

module.exports = {
  freshFetch: freshFetch
};
