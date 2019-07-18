let model_utils = require('../../models/utils');
let getContribsLastMonth = require('./getContribsLastMonth')
let withinThisWeekOrNot = require('./withinThisWeekOrNot')

// Fetches recent week's commits for a particular repo
function getContribsLastWeek(org, repo) {
    let contribs = [];

    return model_utils.getItem(`recent-${repo}-week-expiry`)
            .then((recentCommitsWeekExpiry) => {
                let timeToday = (new Date).getTime();
                // If recent month's commits expiry time is 1 day behind the current time, flush them out.
                if(recentCommitsWeekExpiry!=null && recentCommitsWeekExpiry!=undefined && ((timeToday-recentCommitsWeekExpiry)/1000)>=86400) {
                    return Promise.all([model_utils.deleteItem(`recent-${repo}-week-expiry`), model_utils.deleteItem(`recent-${repo}-week-commits`)])
                        .then(()=> {
                            return true;
                        })
                }
            })
            .then(() => {
                return model_utils.getItem(`recent-${repo}-week-commits`).then((result) => {
                    if(result!=null && result!=undefined) {
                        return result;
                    }
                    else {
                        // We save extra request by filtering commits-made-last-week from commits-made-last month
                        return getContribsLastMonth.getContribsLastMonth(org, repo)
                                .then((commits_last_month) => {
                                    commits_last_month.map((commit_last_month, index) => {
                                        let commit_date = commit_last_month['commit']['committer']['date'];
                                        let check = withinThisWeekOrNot.within_this_week(commit_date);
                                        if(check) {
                                            contribs.push(commit_last_month);
                                        }
                                    });
                                    // Store recentWeekCommits and recentWeekCommitsExpiry in the database
                                    let currTime = (new Date).getTime();
                                    model_utils.setItem(`recent-${repo}-week-commits`, contribs);
                                    model_utils.setItem(`recent-${repo}-week-expiry`, currTime);
                                    return contribs;
                                });
                    }
                });
            });
}





// EXPORTS 
module.exports = {
	getContribsLastWeek: getContribsLastWeek
}