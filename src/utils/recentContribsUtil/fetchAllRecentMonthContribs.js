let model_utils = require('../../models/utils');
let monthsQuery = require('./queryTime')
let fetchRecentMonthContribs = require('./fetchRecentMonthContribs')


// Fetches recent month commits for top 10 repositories
function fetchAllRecentMonthContribs(org, repos, queryTime) {
    let results = [];
    let commitersSet = new Set([]);
    let timeToday = (new Date).getTime();
    let monthInd = monthsQuery.findMonthInd(queryTime);

    // We take only 10 repos just for API quota reasons
    let splicedRepos = repos.splice(0,10);

    let promises = splicedRepos.map(function mapToEachRepo(repo, i) {
        return fetchRecentMonthContribs.fetchRecentMonthContribs(org, repo, queryTime)
        .then((response) => {
            if(response!=null) {
                let partialResult = [];
                response.map(function mappingToCommits(commit, i) {
                    if(commit.author!=null) {
                        if(!commitersSet.has(commit.author.login)) {
                            commitersSet.add(commit.author.login);
                            partialResult.push(commit);
                            results.push(commit);
                        }
                    }
                    return true;
                });
            
                // Save each repo's commits data to the database
                let currTime = (new Date).getTime();
                model_utils.setItem(`recent-${repo}-${monthInd}-month-commits`, partialResult);
                model_utils.setItem(`recent-${repo}-${monthInd}-month-expiry`, currTime);
            }
        })
        .catch((err) => {
            throw err;
        })
    })

    return Promise.all(promises)
    .then(function promisesResolved() {
        // Store recentMonthCommits and recentMonthCommitsExpiry in the database
        model_utils.setItem(`recent-all-${monthInd}-month-commits`, results);
        model_utils.setItem(`recent-all-${monthInd}-month-expiry`, timeToday);
        return results;
    });
}



// EXPORTS
module.exports = {
	fetchAllRecentMonthContribs: fetchAllRecentMonthContribs
}