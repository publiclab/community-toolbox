const modelUtils = require('../../models/utils');
const monthsQuery = require('./queryTime');
const withinMonthsOrNot = require('./withinMonthsOrNot');
const freshFetch = require('./freshFetch');

// Fetches recent month commits for a particular repository
function fetchRecentMonthContribs (org, repo, queryTime) {
  const contribs = [];
  const monthsInd = monthsQuery.findMonthInd(queryTime);

  return modelUtils
    .getItem(`recent-${repo}-${monthsInd}-month-commits`)
    .then(stored => {
      if (stored != null && stored !== undefined) {
        return stored;
      } else {
        return modelUtils
          .getItem(`recent-${repo}-6-month-commits`)
          .then(wholeContribsList => {
            if (wholeContribsList !== undefined && wholeContribsList != null) {
              wholeContribsList.map((contributor, index) => {
                const commitDate = contributor.commit.committer.date;
                const check = withinMonthsOrNot.within_months(
                  commitDate,
                  monthsInd
                );
                if (check) {
                  contribs.push(contributor);
                }
              });
              // Store recentWeekCommits and recentWeekCommitsExpiry in the database
              const currTime = new Date().getTime();
              modelUtils.setItem(
                `recent-${repo}-${monthsInd}-month-commits`,
                contribs
              );
              modelUtils.setItem(
                `recent-${repo}-${monthsInd}-month-expiry`,
                currTime
              );
              return contribs;
            } else {
              // We don't have any recent month contributors' data for desired repository
              // so we need to do all the work now
              return freshFetch
                .freshFetch(org, repo, queryTime)
                .then(response => {
                  return response;
                })
                .catch(err => {
                  throw err;
                });
            }
          })
          .catch(err => {
            throw err;
          });
      }
    })
    .catch(err => {
      throw err;
    });
}

// EXPORTS
module.exports = {
  fetchRecentMonthContribs: fetchRecentMonthContribs
};
