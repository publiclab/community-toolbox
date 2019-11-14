const modelUtils = require('../../models/utils');
const getContribsLastMonth = require('./getContribsLastMonth');
const withinThisWeekOrNot = require('./withinThisWeekOrNot');

// Fetches recent week's commits for a particular repo
function getContribsLastWeek (org, repo) {
  const contribs = [];

  return modelUtils
    .getItem(`recent-${repo}-week-expiry`)
    .then(recentCommitsWeekExpiry => {
      const timeToday = new Date().getTime();
      // If recent month's commits expiry time is 1 day behind the current time, flush them out.
      if (
        recentCommitsWeekExpiry != null &&
        recentCommitsWeekExpiry !== undefined &&
        (timeToday - recentCommitsWeekExpiry) / 1000 >= 86400
      ) {
        return Promise.all([
          modelUtils.deleteItem(`recent-${repo}-week-expiry`),
          modelUtils.deleteItem(`recent-${repo}-week-commits`)
        ]).then(() => {
          return true;
        });
      }
    })
    .then(() => {
      return modelUtils.getItem(`recent-${repo}-week-commits`).then(result => {
        if (result != null && result !== undefined) {
          return result;
        } else {
          // We save extra request by filtering commits-made-last-week from commits-made-last month
          return getContribsLastMonth
            .getContribsLastMonth(org, repo, 6)
            .then(commitsLastMonth => {
              commitsLastMonth.map((commitLastMonth, index) => {
                const commitDate = commitLastMonth.commit.committer.date;
                const check = withinThisWeekOrNot.withinThisWeek(commitDate);
                if (check) {
                  contribs.push(commitLastMonth);
                }
              });
              // Store recentWeekCommits and recentWeekCommitsExpiry in the database
              const currTime = new Date().getTime();
              modelUtils.setItem(`recent-${repo}-week-commits`, contribs);
              modelUtils.setItem(`recent-${repo}-week-expiry`, currTime);
              return contribs;
            });
        }
      });
    });
}

// EXPORTS
module.exports = {
  getContribsLastWeek: getContribsLastWeek
};
