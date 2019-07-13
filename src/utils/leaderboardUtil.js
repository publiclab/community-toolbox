let model_utils = require('../models/utils')
let leaderboardUI = require('../UI/leaderboardUI')
let recentContribsUtil = require('./recentContribsUtil')

function storeLeaderboardData(repo, data, queryTime) {
  let reqTime;
  let timeSpan;
  let checkerTime = (new Date).getDate() - 7;

  reqTime = (queryTime === "week") ? (new Date).getDate() - 7 : 0;
  timeSpan = (reqTime === checkerTime) ? "week" : "month";

  model_utils.setItem(`${repo}-${timeSpan}-leaderboard`, data);
  console.log(`[ ATTENTION ]: Stored data for ${repo} based on last ${timeSpan}'s data`);
}

// TEMPORARILY HERE, BECAUSE OF SOME IMPORT ISSUE =============================================
// Utility function that checks if a given date is behind the current date
// by 7 or less
function within_this_week(date) {
  let current = (new Date).getTime();
  let past_date = (new Date(`${date}`)).getTime();
  let measure = Math.ceil(Math.abs(current - past_date) / (1000*3600*24));
  if(measure<=7) {
      return true;
  }
  return false;
}

function createLeaderboard(org, repo, recencyLabel) {
  let leaderMap = new Map([]);
  let contribs = [];

  return model_utils.getItem(`${repo}-${recencyLabel}-leaderboard`)
  .then((data) => {
    if (data == null || data == undefined) {
      return model_utils.getItem(`${repo}-month-leaderboard`).then((res) => {
        if (res != null && res != undefined) {
          res.map((last_month, index) => {
            let commit_date = last_month['commit']['committer']['date'];
            let check = within_this_week(commit_date);
            if (check) {
              contribs.push(last_month);
            }
          })
          model_utils.setItem(`${repo}-week-leaderboard`, contribs);
          return contribs;
        }
      })
    }
    return data;
  })
  .then((data) => {
    console.log("data = ", data);
    if(data==null || data==undefined) {
      console.log("The repo you're requesting the leaderboard of is not the part of our recent contributors storage, check recent-repo-month-commits!!! ")
      return;
    }
    data.map(function mappingToCommiters(dataItem, i) {
      let temp = leaderMap.get(dataItem.author.login);
      if (temp < 0 || temp == undefined || temp == null) {
        temp = 0;
      }
      temp += 1;
      leaderMap.set(dataItem.author.login, temp);
    })

    const sortedMap = new Map([...leaderMap.entries()].sort((a, b) => b[1] - a[1]));
    leaderboardUI.renderLeaderboard(sortedMap);
  })
}



// EXPORTS
module.exports = {
  storeLeaderboardData: storeLeaderboardData,
  createLeaderboard: createLeaderboard
}
