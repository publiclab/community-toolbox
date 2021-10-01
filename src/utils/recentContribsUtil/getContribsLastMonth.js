let model_utils = require('../../models/utils');
let fetchAllRecentMonthContribs = require('./fetchAllRecentMonthContribs')
let fetchRecentMonthContribs = require('./fetchRecentMonthContribs')


// Fetches recent month's commits for a particular repo or all of the repos (10 repos)
function getContribsLastMonth(org, repo, forMonths) {
    return model_utils.getItem('repos').then((repos) => {
        if(repos!=null && repos!=undefined) {
            return model_utils.getItem(`recent-${repo}-${forMonths}-month-expiry`)
                .then((recentCommitsMonthExpiry) => {
                    let timeToday = (new Date).getTime();
                    // If recentCommits expiry time is 1 day behind the current time, flush them out.
                    if(recentCommitsMonthExpiry!=null && recentCommitsMonthExpiry!=undefined && ((timeToday-recentCommitsMonthExpiry)/1000)>=86400) {
                        return Promise.all([model_utils.deleteItem(`recent-${repo}-${forMonths}-month-commits`), model_utils.deleteItem(`recent-${repo}-${forMonths}-month-expiry`)])
                            .then(() => {
                            return true;
                        })
                    }
                    return true;
                })
                .then((boolean) => {
                    return model_utils.getItem(`recent-${repo}-${forMonths}-month-commits`).then((result) => {
                        if(result!=null && result!=undefined) {
                            return result;
                        }
                        else {
                            // We make queryTime 1 month behind the current time, to pass it as query in the request
                            let d = (new Date);
                            let temp = forMonths*30;
                            d.setDate(d.getDate() - temp);
                            let queryTime = d.toISOString();
                            if(repo==='all') {
                                return fetchAllRecentMonthContribs.fetchAllRecentMonthContribs(org, repos, queryTime)
                                    .then(function gotRecentCommitsInStorage(month_commits) {
                                        return month_commits;
                                    })
                                    .catch((err) => {
                                        throw err;
                                    })
                            }
                            else {
                                return fetchRecentMonthContribs.fetchRecentMonthContribs(org, repo, queryTime)
                                    .then(function gotRecentCommitsInStorage(month_commits) {
                                        return month_commits;
                                    })
                                    .catch((err) => {
                                        throw err;
                                    })
                            }
                        }
                    })
                })
                .catch((err) => {
                    throw err;
                });
        } else {
            console.log("repos are not there yet!!!");
        }
    })
}





// EXPORTS
module.exports = {
	getContribsLastMonth: getContribsLastMonth
}