const modelUtils = require('../../models/utils');
const fetchAllRecentMonthContribs = require('./fetchAllRecentMonthContribs');
const fetchRecentMonthContribs = require('./fetchRecentMonthContribs');

// Fetches recent month's commits for a particular repo or all of the repos (10 repos)
function getContribsLastMonth (org, repo, forMonths) {
  return modelUtils.getItem('repos').then(repos => {
    if (repos != null && repos !== undefined) {
      return modelUtils
        .getItem(`recent-${repo}-${forMonths}-month-expiry`)
        .then(recentCommitsMonthExpiry => {
          const timeToday = new Date().getTime();
          // If recentCommits expiry time is 1 day behind the current time, flush them out.
          if (
            recentCommitsMonthExpiry != null &&
            recentCommitsMonthExpiry !== undefined &&
            (timeToday - recentCommitsMonthExpiry) / 1000 >= 86400
          ) {
            return Promise.all([
              modelUtils.deleteItem(
                `recent-${repo}-${forMonths}-month-commits`
              ),
              modelUtils.deleteItem(`recent-${repo}-${forMonths}-month-expiry`)
            ]).then(() => {
              return true;
            });
          }
          return true;
        })
        .then(boolean => {
          return modelUtils
            .getItem(`recent-${repo}-${forMonths}-month-commits`)
            .then(result => {
              if (result != null && result !== undefined) {
                return result;
              } else {
                // We make queryTime 1 month behind the current time, to pass it as query in the request
                const d = new Date();
                const temp = forMonths * 30;
                d.setDate(d.getDate() - temp);
                const queryTime = d.toISOString();
                if (repo === 'all') {
                  return fetchAllRecentMonthContribs
                    .fetchAllRecentMonthContribs(org, repos, queryTime)
                    .then(function gotRecentCommitsInStorage (monthCommits) {
                      return monthCommits;
                    })
                    .catch(err => {
                      throw err;
                    });
                } else {
                  return fetchRecentMonthContribs
                    .fetchRecentMonthContribs(org, repo, queryTime)
                    .then(function gotRecentCommitsInStorage (monthCommits) {
                      return monthCommits;
                    })
                    .catch(err => {
                      throw err;
                    });
                }
              }
            });
        })
        .catch(err => {
          throw err;
        });
    } else {
      console.log('repos are not there yet!!!');
    }
  });
}

// EXPORTS
module.exports = {
  getContribsLastMonth: getContribsLastMonth
};
