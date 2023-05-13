/* eslint-disable no-undef */
const CommunityToolbox = function CommunityToolbox (org, repo) {
  var SimpleApi = require('github-api-simple');
  var api = new SimpleApi();

  const requestP = require('request-promise');
  var parse = require('parse-link-header');
  var chart = require('./chart');

  var options = {
    qs: {
      sort: 'pushed',
      direction: 'desc', // optional, GitHub API uses 'desc' by default for 'pushed'
      per_page: 100
    }
  };

  // these are essentially examples for now; we could wrap them
  // in externally available methods for convenience but at the
  // moment they're not quite complex enough to merit it.

  function getIssuesForRepo (callback, _options) {
    _options = _options || options;
    api.Issues.getIssuesForRepo(org, repo, _options).then(callback);
  }

  function getIssuesForOrg (_org, _options) {
    _options = _options || options;
    var _url =
      'https://api.github.com/search/issues?q=is%3Aopen+org%3A' +
      _org +
      '+label%3A' +
      _options.qs.labels;
    return requestP({ uri: _url });
  }

  function getCommitsForRepo (callback, _options) {
    _options = _options || options;
    api.Repositories.getRepoCommits(org, repo, _options).then(callback);
  }

  function initialize (org, repo) {
    return new Promise((resolve, reject) => {
      return crud
        .populateDb()
        .then((res) => {
          return true;
        })
        .then((dummy) => {
          return modelUtils.getItem('repos').then((response) => {
            if (response === null || response === undefined) {
              // Fetches and stores the list of repositories when the page loads
              return fetchReposUtil
                .getAllRepos(org)
                .then((resp) => {
                  resolve(true);
                })
                .catch((err) => {
                  // eslint-disable-next-line no-undef
                  Snackbar.show({
                    pos: 'top-right',
                    text: err,
                    textColor: 'red',
                    showAction: false
                  });
                });
            }
            resolve(true);
          });
        });
    });
  }

  function dropdownInit () {
    return modelUtils.getItem('repos').then((res) => {
      if (res !== null && res !== undefined) {
        navDropdownUtil.populateNavDropdown(res);
      } else {
        console.log('not working');
      }
    });
  }

  // This function is responsible for showing contributors
  // on a multi-repository view
  function showAllContributors (org) {
    return contributorsUtil
      .fetchAllContribsInDb(org)
      .then((allContributors) => {
        // If the stored data is not undefined or null, execution goes here
        if (
          allContributors != null &&
          allContributors !== undefined &&
          allContributors.length > 0
        ) {
          // Flushes contributors list from the database after every single day
          const timeNow = new Date().getTime();
          modelUtils
            .getItem('allContributorsExpiry')
            .then((allContributorsExpiry) => {
              if (
                allContributorsExpiry != null &&
                (timeNow - allContributorsExpiry) / 1000 >= 86400
              ) {
                return Promise.all([
                  modelUtils.deleteItem('allContributors'),
                  modelUtils.deleteItem('allContributorsExpiry')
                ]).then(() => {
                  return true;
                });
              }
            })
            .then(() => {
              // Looking for contributors list in the database
              modelUtils.getItem('allContributors').then((AllContributors) => {
                // If the data is not in the database, it gets fetched from storeAllContributorsInDatabase function
                if (
                  AllContributors == null ||
                  AllContributors === undefined ||
                  AllContributors.length === 0
                ) {
                  contributorsUtil
                    .fetchAllContribsInDb(org)
                    .then(function gotAllContributors (AllContributors) {
                      // Provides fetched contributors list to UI function for rendering it
                      // to the user
                      contributorsUI.insertContributors(AllContributors);
                    })
                    .catch((err) => {
                      throw err;
                    });
                  // eslint-disable-next-line brace-style
                }
                // If stored data is not null and undefined, process it
                else {
                  contributorsUI.insertContributors(AllContributors);
                }
              });
            });
          // eslint-disable-next-line brace-style
        }
        // If execution goes here, it means that there's probably something wrong
        // in the storeAllContributorsInDatabase function
        else {
          console.log(
            'Something went wrong while fetching all contributors :('
          );
        }
      })
      .catch((err) => {
        // eslint-disable-next-line no-undef
        Snackbar.show({
          pos: 'top-right',
          text: err,
          textColor: 'red',
          showAction: false
        });
      });
  }

  // This function is responsible for showing all the contributors for a particular repository
  function showRepoContributors (org, repo) {
    return contributorsUtil
      .fetchAllContribsInDb(org)
      .then((allContributors) => {
        // If the stored data is not undefined or null, execution goes here
        if (
          allContributors != null &&
          allContributors !== undefined &&
          allContributors.length > 0
        ) {
          // Flushes repoContributors from the database after every single day
          const timeNow = new Date().getTime();
          modelUtils
            .getItem(`${repo}Expiry`)
            .then((lifespan) => {
              if (lifespan != null && (timeNow - lifespan) / 1000 >= 86400) {
                return Promise.all([
                  modelUtils.deleteItem(`${repo}`),
                  modelUtils.deleteItem(`${repo}Expiry`)
                ]).then(() => {
                  return true;
                });
              }
            })
            .then(() => {
              // Looking for repo Contributors list in the database
              modelUtils.getItem(repo).then((repoContributors) => {
                // If we don't have repoContributors in the database, we fetch them from Github
                if (
                  repoContributors === null ||
                  repoContributors === undefined
                ) {
                  contributorsUtil
                    .repoContribsUtil(org, repo)
                    .then(function gotRepoContributorsInStorage (contributors) {
                      contributorsUI.insertContributors(contributors);
                    })
                    .catch((err) => {
                      throw err;
                    });
                  // eslint-disable-next-line brace-style
                }
                // If we have repoContributors in the database, we save a network call :)
                else {
                  contributorsUI.insertContributors(repoContributors);
                }
              });
            });
        } else {
          // Execution goes here, it means that data for this repo is not available
          // in the database
          console.log(
            `Something went wrong while getting ${repo} contributors :(`
          );
        }
      })
      .catch((err) => {
        // eslint-disable-next-line no-undef
        Snackbar.show({
          pos: 'top-right',
          text: err,
          textColor: 'red',
          showAction: false
        });
      });
  }

  // Function for fetching and showing recent contributors
  function showRecentContributors (org, repo, recencyLabel, forMonths = 6) {
    return recentContribsUtil
      .fetchAllRecentContribsInDb(org, repo)
      .then((result) => {
        if (recencyLabel === 'month') {
          return recentContribsUtil
            .fetchContribsLastMonth(org, repo, forMonths)
            .then(function gotMonthlyContribs (monthContribs) {
              // Stores the CURRENTLY ACTIVE recent contribs data which is utilized by filter
              modelUtils.deleteItem('recent-contribs-data').then((res) => {
                modelUtils.setItem('recent-contribs-data', monthContribs);
              });
              // Push data to UI
              recentContributorsUI.insertRecentContributors(monthContribs);
            })
            .catch((err) => {
              throw err;
            });
        } else {
          return recentContribsUtil
            .fetchContribsLastWeek(org, repo)
            .then((weeklyContribs) => {
              // Stores the CURRENTLY ACTIVE recent contribs data which is utilized by filter
              modelUtils.deleteItem('recent-contribs-data').then((res) => {
                modelUtils.setItem('recent-contribs-data', weeklyContribs);
              });
              // Push data to UI
              recentContributorsUI.insertRecentContributors(weeklyContribs);
            })
            .catch((err) => {
              throw err;
            });
        }
      })
      .catch((err) => {
        // eslint-disable-next-line no-undef
        Snackbar.show({
          pos: 'top-right',
          text: err,
          textColor: 'red',
          showAction: false
        });
      });
  }

  function filter (org, type) {
    modelUtils.getItem('recent-contribs-data').then(function gotData (response) {
      if (response != null && response !== undefined) {
        const newResponse = filterUtil.showFilteredData(org, type, response);
        recentContributorsUI.insertRecentContributors(newResponse);
      } else {
        console.log(
          'recent-contribs-data not present in DB! Nothing is filtered!!!'
        );
      }
    });
  }

  function showStaleIssues (org, repo) {
    return issuesUtil
      .getRepoStaleIssues(org, repo)
      .then((data) => {
        if (data !== null && data !== undefined) {
          issuesUI.insertStale(data, '.stale');
        }
      })
      .catch((err) => {
        Snackbar.show({
          pos: 'top-right',
          text: err,
          textColor: 'red',
          showAction: false
        });
      });
  }

  function clearDB () {
    return fetch('https://api.github.com/rate_limit')
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        const reqLeft = res.rate.remaining;
        const resetTime = res.rate.reset;
        const currTime = new Date().getTime() / 1000;
        let timeDiff = resetTime - currTime;
        timeDiff = Math.floor(Math.floor(timeDiff) / 60);
        if (reqLeft >= 60) {
          return model_utils.clearDB().then(() => {
            Snackbar.show({
              pos: 'top-right',
              text: 'Database is refreshed!',
              textColor: 'green',
              showAction: false
            });
            return true;
          });
        } else {
          Snackbar.show({
            pos: 'top-right',
            text: `You can generate the updated stats after ${timeDiff} minutes.`,
            textColor: 'red',
            showAction: false
          });
          return false;
        }
      });
  }

  // externally available API
  return {
    api: api,
    issuesUI: issuesUI,
    contributorsUI: contributorsUI,
    recentContributorsUI: recentContributorsUI,
    parse: parse,
    chart: chart,
    options: options,
    getIssuesForRepo: getIssuesForRepo,
    getIssuesForOrg: getIssuesForOrg,
    showRecentContributors: showRecentContributors,
    getCommitsForRepo: getCommitsForRepo,
    showAllContributors: showAllContributors,
    showRepoContributors: showRepoContributors,
    initialize: initialize,
    dropdownInit: dropdownInit,
    ftoAuthorsUI: ftoAuthorsUI,
    showStaleIssues: showStaleIssues,
    filter: filter,
    clearDB: clearDB
  };
};

module.exports = CommunityToolbox;
