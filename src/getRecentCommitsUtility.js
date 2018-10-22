function fetchRecentCommits(repos, queryTime) {
    var commitersSet = new Set([]);
    var results = [];
    let timeToday = (new Date).getTime();
    // We take only first 20 repos to stay under API quota
    let splicedRepos = repos.splice(0,20);

    var promises = splicedRepos.map(function mapToEachRepo(repo, i) {
        return fetch(`https://api.github.com/repos/publiclab/${repo}/commits?since=${queryTime}`)
                .then(function gotResponse(response) {
                    if(response.status=="200") {
                        return response.json();
                    }
                })
                .then(function gotResponseJson(response) {
                    if(response!=null && response.length>0) {
                        response.map(function mappingToCommits(commit, i) {
                            if(!commitersSet.has(commit.author.login)) {
                                commitersSet.add(commit.author.login);
                                results.push(commit);
                            }
                            return true;
                        });
                    }
                    return true;
                });
        });

    return Promise.all(promises)
           .then(function promisesResolved() {
                // Store recentCommits and recentCommitsExpiry in the localStorage
                localStorage.setItem('recentCommits', JSON.stringify(results));
                localStorage.setItem('recentCommitsExpiry', timeToday);
                return results;
           });
} 



// EXPORTS
module.exports = {
    fetchRecentCommits: fetchRecentCommits,
}