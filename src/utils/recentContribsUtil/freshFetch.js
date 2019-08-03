let model_utils = require('../../models/utils')
let monthsQuery = require('./queryTime')

function freshFetch(org, repo, queryTime) {
	let commitersSet = new Set([]);
    let result=[];
	let proms = [];
	let monthsInd = monthsQuery.findMonthInd(queryTime);

    for(let i=0;i<2;i++) {
        proms.push(
            fetch(`https://api.github.com/repos/${org}/${repo}/commits?since=${queryTime}&per_page=100&page=${i}`)
            .then(function gotResponse(response) {
                if(response.status=="200") {
                    return response.json();
                }else {
                    throw `Couldn't fetch commits for ${repo}`;
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
                }
            })
        )
    }

    return Promise.all(proms)
    .then(() => {
        // Save each repo's commits data to the database
        let currTime = (new Date).getTime();
        model_utils.setItem(`recent-${repo}-${monthsInd}-month-commits`, result);
        model_utils.setItem(`recent-${repo}-${monthsInd}-month-expiry`, currTime);
        return result;
    })
}



module.exports = {
	freshFetch: freshFetch
}