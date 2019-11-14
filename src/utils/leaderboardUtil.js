const modelUtils = require('../models/utils');
const leaderboardUI = require('../UI/leaderboardUI');
// eslint-disable-next-line no-unused-vars
const recentContribsUtil = require('./recentContribsUtil');

function storeLeaderboardData (repo, data, queryTime) {
  const checkerTime = new Date().getDate() - 7;

  const reqTime = queryTime === 'week' ? new Date().getDate() - 7 : 0;
  const timeSpan = reqTime === checkerTime ? 'week' : 'month';

  modelUtils.setItem(`${repo}-${timeSpan}-leaderboard`, data);
  console.log(
    `[ ATTENTION ]: Stored data for ${repo} based on last ${timeSpan}'s data`
  );
}

// TEMPORARILY HERE, BECAUSE OF SOME IMPORT ISSUE =============================================
// Utility function that checks if a given date is behind the current date
// by 7 or less
function withinThisWeek (date) {
  const current = new Date().getTime();
  const pastDate = new Date(`${date}`).getTime();
  const measure = Math.ceil(Math.abs(current - pastDate) / (1000 * 3600 * 24));
  if (measure <= 7) {
    return true;
  }
  return false;
}

function fetchWeeklyContribs (res) {
  const contribs = [];
  res.map((lastMonth, index) => {
    const commitDate = lastMonth.commit.committer.date;
    const check = withinThisWeek(commitDate);
    if (check) {
      contribs.push(lastMonth);
    }
  });
  return contribs;
}

function createLeaderboard (org, repo, recencyLabel) {
  const leaderMap = new Map([]);
  let contribs = [];

  return modelUtils
    .getItem(`${repo}-${recencyLabel}-leaderboard`)
    .then(data => {
      if (data == null || data === undefined) {
        return modelUtils.getItem(`${repo}-month-leaderboard`).then(res => {
          if (res != null && res !== undefined) {
            contribs = fetchWeeklyContribs(res);
            modelUtils.setItem(`${repo}-week-leaderboard`, contribs);
            return contribs;
          }
        });
      }
      return data;
    })
    .then(data => {
      if (data == null || data === undefined) {
        console.log(
          "The repo you're requesting the leaderboard of is not the part of our recent contributors storage, working on it... "
        );
        return modelUtils.getItem(`recent-${repo}-month-commits`).then(res => {
          if (res != null && res !== undefined) {
            modelUtils.setItem(`${repo}-month-leaderboard`, res);
            contribs = fetchWeeklyContribs(res);
            modelUtils.setItem(`${repo}-week-leaderboard`, contribs);
            return contribs;
          }
        });
      }
      return data;
    })
    .then(data => {
      data.map(function mappingToCommiters (dataItem, i) {
        let temp = leaderMap.get(dataItem.author.login);
        if (temp < 0 || temp === undefined || temp == null) {
          temp = 0;
        }
        temp += 1;
        leaderMap.set(dataItem.author.login, temp);
      });

      const sortedMap = new Map(
        [...leaderMap.entries()].sort((a, b) => b[1] - a[1])
      );
      leaderboardUI.renderLeaderboard(sortedMap);
    });
}

// EXPORTS
module.exports = {
  storeLeaderboardData: storeLeaderboardData,
  createLeaderboard: createLeaderboard
};
