let model_utils = require('../../models/utils');

// Fetches recent month commits for a particular repository 
function fetchRecentMonthContribs(org, repo, queryTime) {
    let commitersSet = new Set([]);
    let result=[];
    return fetch(`https://api.github.com/repos/${org}/${repo}/commits?since=${queryTime}`)
            .then(function gotResponse(response) {
                if(response.status=="200") {
                    return response.json();
                }
            })
            .then(function gotResponseJson(response) {
                if(response!=null) {
                    response.map(function mappingToCommits(commit, i) {
                        if(commit.author!=null) {
                            if(!commitersSet.has(commit.author.login)) {
                                commitersSet.add(commit.author.login);
                                result.push(commit);
                            }
                        }
                        return true;
                    });

                    // Save each repo's commits data to the database
                    let currTime = (new Date).getTime();
                    model_utils.setItem(`recent-${repo}-month-commits`, result);
                    model_utils.setItem(`recent-${repo}-month-expiry`, currTime);
                }
                return result;
            });
}





// EXPORTS
module.exports = {
	fetchRecentMonthContribs: fetchRecentMonthContribs
}