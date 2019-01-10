var getAllContribsUtility = require('./getAllContribsUtility');


function fetchRecentCommits(repos, queryTime) {
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
                localStorage.setItem('recentMCommits', JSON.stringify(results));
                localStorage.setItem('recentCommitsMExpiry', timeToday);
                return results;
            });
} 


// Fetches the list of active contributors last Week
function getCommitsLastWeek(org) {
    let recentCommitsMExpiry = localStorage.getItem('recentCommitsExpiry');
    let timeToday = (new Date).getTime();
    // If recentCommits expiry time is 1 day behind the current time, flush them out.
    if(recentCommitsMExpiry!=null && ((timeToday-recentCommitsMExpiry)/1000)>=86400) {
      localStorage.removeItem('recentCommitsExpiry');
      localStorage.removeItem('recentCommits');
    }

    let weekly_contribs = JSON.parse(localStorage.getItem('recentCommits'));
    if(weekly_contribs!=null && weekly_contribs!=undefined && weekly_contribs.length>0) {
        return new Promise((resolve, reject) => {resolve(weekly_contribs)});
    }else {
        let commits_last_month;
        let contribs = [];
        commits_last_month = JSON.parse(localStorage.getItem('recentMCommits'));
        if(commits_last_month==null || commits_last_month==undefined || commits_last_month.length==0) {
            return getCommitsLastMonth(org).then((commits) => {
                commits_last_month = commits;
                commits_last_month.map((commit_last_month, index) => {
                    let commit_date = commit_last_month['commit']['committer']['date'];
                    let check = within_this_week(commit_date);
                    if(check) {
                        contribs.push(commit_last_month);
                    }
                });
        
                let timeToday = (new Date).getTime();
                localStorage.setItem('recentCommits', JSON.stringify(contribs));
                localStorage.setItem('recentCommitsExpiry', timeToday);
                return contribs;
            });
        }
        else {
          commits_last_month.map((commit_last_month, index) => {
            let commit_date = commit_last_month['commit']['committer']['date'];
            let check = within_this_week(commit_date);
            if(check) {
                contribs.push(commit_last_month);
            }
          });
  
          let timeToday = (new Date).getTime();
          localStorage.setItem('recentCommits', JSON.stringify(contribs));
          localStorage.setItem('recentCommitsExpiry', timeToday);
          return new Promise((resolve, reject) => {resolve(contribs)});
        }
    }
}

// Utility function that checks if a given date is behind the current date
// by 7 or less
function within_this_week(date) {
    let current = (new Date).getTime();
    let past_date = (new Date(`${date}`)).getTime();
    let measure = Math.ceil(Math.abs(current - past_date) / (1000*3600*24));
    if(measure<=7) {
        return true;
    }
    return false;
}


// Fetches the list of active contributors last Week
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

    // There is no list of recentCommits in localStorage,
    // we need to get it from Github
    if(recentCommits==null || recentCommits.length==0) {
      if(repos==null || repos.length == 0) {
        return getAllContribsUtility.getAllRepos(org)
        .then(function gotAllRepos(repos) {
          return fetchRecentCommits(repos, queryTime)
          .then(function gotRecentCommitsInStorage(commits) {
            return commits;
          })
        });
      } else  {
        // Repos are in the localStorage, we saved a network call!
        return fetchRecentCommits(repos, queryTime)
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
    getCommitsLastMonth: getCommitsLastMonth,
    getCommitsLastWeek: getCommitsLastWeek,
    within_this_week: within_this_week
}
