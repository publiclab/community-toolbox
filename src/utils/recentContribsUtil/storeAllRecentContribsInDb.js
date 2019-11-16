const fetchAllRecentMonthContribs = require('./fetchAllRecentMonthContribs');
const fetchRepoUtil = require('../repoUtil/fetchRepoUtil');
const modelUtils = require('../../models/utils');

// Stores all the Recent Contributors in the database
function storeAllRecentContribsInDb (org, repo) {
  // We make queryTime 1 month behind the current time, to pass it as query in the request
  const d = new Date();
  d.setDate(d.getDate() - 180);
  const queryTime = d.toISOString();
  return modelUtils
    .getItem('repos')
    .then(repos => {
      return modelUtils.getItem('recent-present').then(result => {
        if (result != null && result !== undefined) {
          return result;
        } else {
          if (repos != null || repos !== undefined) {
            return fetchAllRecentMonthContribs
              .fetchAllRecentMonthContribs(org, repos, queryTime)
              .then(result => {
                modelUtils.setItem('recent-present', 'true');
                return result;
              })
              .catch(err => {
                throw err;
              });
          } else {
            fetchRepoUtil.getAllRepos(org).then(repos => {
              if (repos != null || repos !== undefined) {
                return fetchAllRecentMonthContribs
                  .fetchAllRecentMonthContribs(org, repos, queryTime)
                  .then(result => {
                    modelUtils.setItem('recent-present', 'true');
                    return result;
                  })
                  .catch(err => {
                    throw err;
                  });
              }
            });
          }
        }
      });
    })
    .catch(err => {
      throw err;
    });
}

// EXPORTS
module.exports = {
  storeAllRecentContribsInDb: storeAllRecentContribsInDb
};
