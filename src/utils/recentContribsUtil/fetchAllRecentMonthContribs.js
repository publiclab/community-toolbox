let model_utils = require('../../models/utils');

// Fetches recent month commits for top 10 repositories
function fetchAllRecentMonthContribs(org, repos, queryTime) {
    let results = [];
    let commitersSet = new Set([]);
    let timeToday = (new Date).getTime();

    // We take only 10 repos just for API quota reasons
    let splicedRepos = repos.splice(0,10);

    let promises = splicedRepos.map(function mapToEachRepo(repo, i) {
        return fetch(`https://api.github.com/repos/${org}/${repo}/commits?since=${queryTime}`)
                .then(function gotResponse(response) {
                    if(response.status=="200") {
                        return response.json();
                    }
                })
                .then(function gotResponseJson(response) {
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
                        model_utils.setItem(`recent-${repo}-month-commits`, partialResult);
                        model_utils.setItem(`recent-${repo}-month-expiry`, currTime);
                    }
                    return true;
                });
        });

    return Promise.all(promises)
           .then(function promisesResolved() {
                // Store recentMonthCommits and recentMonthCommitsExpiry in the database
                model_utils.setItem('recent-all-month-commits', results);
                model_utils.setItem('recent-all-month-expiry', timeToday);
                return results;
            });
}




// EXPORTS
module.exports = {
	fetchAllRecentMonthContribs: fetchAllRecentMonthContribs
}