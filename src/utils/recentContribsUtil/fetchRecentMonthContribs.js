let model_utils = require('../../models/utils')
let monthsQuery = require('./queryTime')
let withinMonthsOrNot = require('./withinMonthsOrNot')
let freshFetch = require('./freshFetch')

// Fetches recent month commits for a particular repository 
function fetchRecentMonthContribs(org, repo, queryTime) {
    let contribs = [];
    let monthsInd = monthsQuery.findMonthInd(queryTime);

    return model_utils.getItem(`recent-${repo}-${monthsInd}-month-commits`)
    .then((stored) => {
        if(stored!=null && stored!=undefined) {
            return stored;
        }
        else {
            return model_utils.getItem(`recent-${repo}-6-month-commits`)
            .then((wholeContribsList) => {
                if(wholeContribsList!=undefined && wholeContribsList!=null) {
                    wholeContribsList.map((contributor, index) => {
                        let commit_date = contributor['commit']['committer']['date'];
                        let check = withinMonthsOrNot.within_months(commit_date, monthsInd);
                        if(check) {
                            contribs.push(contributor);
                        }
                    });
                    // Store recentWeekCommits and recentWeekCommitsExpiry in the database
                    let currTime = (new Date).getTime();
                    model_utils.setItem(`recent-${repo}-${monthsInd}-month-commits`, contribs);
                    model_utils.setItem(`recent-${repo}-${monthsInd}-month-expiry`, currTime);
                    return contribs;
                }
                else {
                    // We don't have any recent month contributors' data for desired repository
                    // so we need to do all the work now
                    return freshFetch.freshFetch(org, repo, queryTime)
                    .then((response) => {
                        return response;
                    })
                    .catch((err) => {
                        throw err;
                    })
                }
            })
            .catch((err) => {
                throw err;
            })
            
        }
    })
    .catch((err) => {
        throw err;
    })

    
}





// EXPORTS
module.exports = {
	fetchRecentMonthContribs: fetchRecentMonthContribs
}