var getAllContribsUtility = require('./getAllContribsUtility');


function fetchRecentCommits(repos, queryTime, flag) {
    var commitersSet = new Set([]);
    var results = [];
    let timeToday = (new Date).getTime();
    // We take only first 10 repos to stay under API quota
    let splicedRepos = repos.splice(0, 10);

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
                            if(commit!=null) {
                                if(!commitersSet.has(commit.author.login)) {
                                    commitersSet.add(commit.author.login);
                                    results.push(commit);
                                }
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
                if(flag==='w') {
                    localStorage.setItem('recentCommits', JSON.stringify(results));
                    localStorage.setItem('recentCommitsExpiry', timeToday);
                    return results;
                } else if(flag==='m') {
                    localStorage.setItem('recentMCommits', JSON.stringify(results));
                    localStorage.setItem('recentCommitsMExpiry', timeToday);
                    return results;
                }  
                return true;
            });
} 


// Gets the list of active contributors last Week
function getCommitsLastWeek(org) {
    let repos = JSON.parse(localStorage.getItem('repos'));
    let recentCommitsExpiry = localStorage.getItem('recentCommitsExpiry');
    let timeToday = (new Date).getTime();
    // If recentCommits expiry time is 1 day behind the current time, flush them out.
    if(recentCommitsExpiry!=null && ((timeToday-recentCommitsExpiry)/1000)>=86400) {
      localStorage.removeItem('recentCommitsExpiry');
      localStorage.removeItem('recentCommits');
    }

    // We make queryTime 1 week behind the current time, to pass it as query in the request
    let d = (new Date);
    d.setDate(d.getDate() - 7);
    let queryTime = d.toISOString();
    
    var recentCommits = JSON.parse(localStorage.getItem('recentCommits'));
    // This flag is used to distinguish the place to store the result in localStorage
    let flag = 'w';

    // There is no list of recentCommits in localStorage,
    // we need to get it from Github
    if(recentCommits==null || recentCommits.length==0) {
      if(repos==null || repos.length == 0) {
        return getAllContribsUtility.getAllRepos(org)
        .then(function gotAllRepos(repos) {
          return fetchRecentCommits(repos, queryTime, flag)
                .then(function gotRecentCommitsInStorage(commits) {
                    return commits;
                })
        });
      } else  {
        // Repos are in the localStorage, we saved a network call!
        return fetchRecentCommits(repos, queryTime, flag)
                .then(function gotRecentCommitsInStorage(commits) {
                    return commits;
                });
      }
    } else {
        // RecentCommits are in the localStorage, no need for any network call!!!
        return new Promise(function returningPromise(resolve, reject) {resolve(recentCommits)});
    }
}


function getCommitsLastMonth(org) {
    let repos = JSON.parse(localStorage.getItem('repos'));
    let recentCommitsMExpiry = localStorage.getItem('recentCommitsMExpiry');
    let timeToday = (new Date).getTime();
    // If recentCommits expiry time is 1 day behind the current time, flush them out.
    if(recentCommitsMExpiry!=null && ((timeToday-recentCommitsMExpiry)/1000)>=86400) {
      localStorage.removeItem('recentCommitsMExpiry');
      localStorage.removeItem('recentMCommits');
    }

    // We make queryTime 1 month behind the current time, to pass it as query in the request
    let d = (new Date);
    d.setDate(d.getDate() - 30);
    let queryTime = d.toISOString();

    var recentCommits = JSON.parse(localStorage.getItem('recentMCommits'));
    // This flag is used to distinguish the place to store the result in localStorage
    var flag = 'm';

    // There is no list of recentCommits in localStorage,
    // we need to get it from Github
    if(recentCommits==null || recentCommits.length==0) {
      if(repos==null || repos.length == 0) {
        return getAllContribsUtility.getAllRepos(org)
        .then(function gotAllRepos(repos) {
          return fetchRecentCommits(repos, queryTime, flag)
          .then(function gotRecentCommitsInStorage(commits) {
            return commits;
          })
        });
      } else  {
        // Repos are in the localStorage, we saved a network call!
        return fetchRecentCommits(repos, queryTime, flag)
        .then(function gotRecentCommitsInStorage(commits) {
            return commits;
        });
      }
    } else {
        // RecentCommits are in the localStorage, no need for any network call!!!
        return new Promise(function returningPromise(resolve, reject) {resolve(recentCommits)});
    }
}



// EXPORTS
module.exports = {
    fetchRecentCommits: fetchRecentCommits,
    getCommitsLastWeek: getCommitsLastWeek,
    getCommitsLastMonth: getCommitsLastMonth
}