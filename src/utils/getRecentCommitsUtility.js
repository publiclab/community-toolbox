var getAllContribsUtility = require('../utils/getAllContribsUtility');
var model_utils = require('../models/utils');

// Fetches recent month commits for a particular repository 
function fetchRecentMonthCommits(org, repo, queryTime) {
    let commitersSet = new Set([]);
    let result = [];
    return fetch(`https://api.github.com/repos/${org}/${repo}/commits?since=${queryTime}`)
        .then(function gotResponse(response) {
            if (response.status == "200") {
                return response.json();
            }
        })
        .then(function gotResponseJson(response) {
            if (response != null) {
                response.map(function mappingToCommits(commit, i) {
                    if (commit != null) {
                        if (!commitersSet.has(commit.author.login)) {
                            commitersSet.add(commit.author.login);
                            result.push(commit);
                        }
                    }
                    return true;
                });

                // Save each repo's commits data to the database
                let currTime = (new Date).getTime();
                console.log(`in fetchRecentMonthCommits, storing recent-${repo}-month-commits`);
                model_utils.setItem(`recent-${repo}-month-commits`, result);
                model_utils.setItem(`recent-${repo}-month-expiry`, currTime);
            }
            return result;
        });
}

// Fetches recent month commits for top 10 repositories
function fetchAllRecentMonthCommits(org, repos, queryTime) {
    let results = [];
    let commitersSet = new Set([]);
    let timeToday = (new Date).getTime();

    // We take only 10 repos just for API quota reasons
    let splicedRepos = repos.splice(0, 10);

    let promises = splicedRepos.map(function mapToEachRepo(repo, i) {
        return fetch(`https://api.github.com/repos/${org}/${repo}/commits?since=${queryTime}`)
            .then(function gotResponse(response) {
                if (response.status == "200") {
                    return response.json();
                }
            })
            .then(function gotResponseJson(response) {
                if (response != null) {
                    let partialResult = [];
                    response.map(function mappingToCommits(commit, i) {
                        if (commit != null) {
                            if (!commitersSet.has(commit.author.login)) {
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

                    // Push every repo's contribs to results array
                    // results.push(partialResult);
                }
                return true;
            });
    });

    return Promise.all(promises)
        .then(function promisesResolved() {
            // Store recentMonthCommits and recentMonthCommitsExpiry in the database
            console.log(`in fetchALLRecentMonthCommits, storing recent-ALL-month-commits`);
            model_utils.setItem('recent-all-month-commits', results);
            model_utils.setItem('recent-all-month-expiry', timeToday);
            return results;
        });
}


function getCommitsLastWeek(org, repo) {
    let contribs = [];

    return model_utils.getItem(`recent-${repo}-week-expiry`)
        .then((recentCommitsWeekExpiry) => {
            let timeToday = (new Date).getTime();
            // If recent month's commits expiry time is 1 day behind the current time, flush them out.
            if (recentCommitsWeekExpiry != null && recentCommitsWeekExpiry != undefined && ((timeToday - recentCommitsWeekExpiry) / 1000) >= 86400) {
                console.log("deleting");
                return Promise.all([model_utils.deleteItem(`recent-${repo}-week-expiry`), model_utils.deleteItem(`recent-${repo}-week-commits`)])
                    .then(() => {
                        return true;
                    })
            }
        })
        .then(() => {
            return model_utils.getItem(`recent-${repo}-week-commits`).then((result) => {
                if (result != null && result != undefined) {
                    return result;
                }
                else {
                    return getCommitsLastMonth(org, repo)
                        .then((commits_last_month) => {
                            commits_last_month.map((commit_last_month, index) => {
                                let commit_date = commit_last_month['commit']['committer']['date'];
                                let check = within_this_week(commit_date);
                                if (check) {
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



// Utility function that checks if a given date is behind the current date
// by 7 or less
function within_this_week(date) {
    let current = (new Date).getTime();
    let past_date = (new Date(`${date}`)).getTime();
    let measure = Math.ceil(Math.abs(current - past_date) / (1000 * 3600 * 24));
    if (measure <= 7) {
        return true;
    }
    return false;
}

// Fetches recent month's commits for a particular repo or all of the repos (10 repos)
function getCommitsLastMonth(org, repo) {
    return model_utils.getItem('repos').then((repos) => {
        if (repos != null && repos != undefined) {
            return model_utils.getItem(`recent-${repo}-month-expiry`)
                .then((recentCommitsMonthExpiry) => {
                    let timeToday = (new Date).getTime();
                    // If recentCommits expiry time is 1 day behind the current time, flush them out.
                    if (recentCommitsMonthExpiry != null && recentCommitsMonthExpiry != undefined && ((timeToday - recentCommitsMonthExpiry) / 1000) >= 86400) {
                        console.log("Deleting month contribs");
                        return Promise.all([model_utils.deleteItem(`recent-${repo}-month-commits`), model_utils.deleteItem(`recent-${repo}-month-expiry`)])
                            .then(() => {
                                return true;
                            })
                    }
                    return true;
                })
                .then((boolean) => {
                    return model_utils.getItem(`recent-${repo}-month-commits`).then((result) => {
                        if (result != null && result != undefined) {
                            return result;
                        }
                        else {
                            // We make queryTime 1 month behind the current time, to pass it as query in the request
                            let d = (new Date);
                            d.setDate(d.getDate() - 30);
                            let queryTime = d.toISOString();
                            if (repo === 'all') {
                                return fetchAllRecentMonthCommits(org, repos, queryTime)
                                    .then(function gotRecentCommitsInStorage(month_commits) {
                                        console.log("got all monthly contribs from fetchAllRecentMonthCommits");
                                        return month_commits;
                                    });
                            }
                            else {
                                return fetchRecentMonthCommits(org, repo, queryTime)
                                    .then(function gotRecentCommitsInStorage(month_commits) {
                                        console.log("got repo's month commits from fetch");
                                        return month_commits;
                                    })
                            }
                        }
                    })
                })
        }
    })
}



// EXPORTS
module.exports = {
    fetchAllRecentMonthCommits: fetchAllRecentMonthCommits,
    fetchRecentMonthCommits: fetchRecentMonthCommits,
    getCommitsLastMonth: getCommitsLastMonth,
    getCommitsLastWeek: getCommitsLastWeek,
    within_this_week: within_this_week
}
