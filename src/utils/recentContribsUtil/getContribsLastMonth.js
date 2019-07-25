let model_utils = require('../../models/utils');
let fetchAllRecentMonthContribs = require('./fetchAllRecentMonthContribs')
let fetchRecentMonthContribs = require('./fetchRecentMonthContribs')


// Fetches recent month's commits for a particular repo or all of the repos (10 repos)
function getContribsLastMonth(org, repo) {
    return model_utils.getItem('repos')
    .then((repos) => {
        if(repos!=null && repos!=undefined) {
            return model_utils.getItem(`recent-${repo}-month-expiry`)
                .then((recentCommitsMonthExpiry) => {
                    let timeToday = (new Date).getTime();
                    // If recentCommits expiry time is 1 day behind the current time, flush them out.
                    if(recentCommitsMonthExpiry!=null && recentCommitsMonthExpiry!=undefined && ((timeToday-recentCommitsMonthExpiry)/1000)>=86400) {
                        return Promise.all([model_utils.deleteItem(`recent-${repo}-month-commits`), model_utils.deleteItem(`recent-${repo}-month-expiry`)])
                            .then(() => {
                            return true;
                        })
                    }
                    return true;
                })
                .then((boolean) => {
                    return model_utils.getItem(`recent-${repo}-month-commits`).then((result) => {
                        if(result!=null && result!=undefined) {
                            return result;
                        }
                        else {
                            // We make queryTime 1 month behind the current time, to pass it as query in the request
                            let d = (new Date);
                            d.setDate(d.getDate() - 30);
                            let queryTime = d.toISOString();
                            if(repo==='all') {
                                return fetchAllRecentMonthContribs.fetchAllRecentMonthContribs(org, repos, queryTime)
                                    .then(function gotRecentCommitsInStorage(month_commits) {
                                        return month_commits;
                                    })
                                    .catch((err) => {
                                        console.log("throwing from getContribsLastMonth");
                                        throw err;
                                    })
                            }
                            else {
                                return fetchRecentMonthContribs.fetchRecentMonthContribs(org, repo, queryTime)
                                    .then(function gotRecentCommitsInStorage(month_commits) {
                                        return month_commits;
                                    })
                                    .catch((err) => {
                                        console.log("throwing from getContribsLastMonth");
                                        throw err;
                                    })
                            }
                        }
                    })
                })
                .catch((err) => {
                    console.log("finally throwing from getContribsLastMonth");
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