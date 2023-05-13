const fetchRepoContributorsUtil = require('./fetchRepoContribsUtil');
const modelUtils = require('../../models/utils');

// This runs at the very start of page load and stores all the repositories and all the
// contributors in the database on initial page load
function storeAllContribsInDb (org) {
  const AllContributors = [];
  const promises = [];
  const contributorSet = new Set([]);
  return new Promise((resolve, reject) => {
    modelUtils
      .getItem('allContributors')
      .then((allContributors) => {
        // If all contributors list is not in the database, it makes a fresh call to Github API
        if (
          allContributors === null ||
          allContributors === undefined ||
          allContributors.length === 0
        ) {
          return modelUtils.getItem('repos').then((res) => {
            const splicedRepos = res.splice(0, 20);
            splicedRepos.map(function mappingToEachRepo (Repo, i) {
              const promise = fetchRepoContributorsUtil
                .fetchRepoContributorsUtil(org, Repo)
                .then(function gotRepoContributorsInStorage (contributors) {
                  if (contributors !== undefined && contributors.length > 0) {
                    contributors.map((contributor, i) => {
                      if (!contributorSet.has(contributor.login)) {
                        contributorSet.add(contributor.login);
                        AllContributors.push(contributor);
                      }
                    });
                  }
                })
                .catch((err) => {
                  throw err;
                });
              promises.push(promise);
            });
            return Promise.all(promises).then(() => {
              // Storing array containing all the contributors' list across 20 most active
              // repos to database
              modelUtils.setItem('allContributors', AllContributors);
              // Saves current time in epoch, used for flushing out the stored data
              // after 24 hours
              const currentTime = new Date().getTime();
              modelUtils.setItem('allContributorsExpiry', currentTime);
              resolve(AllContributors);
            });
          });
        } else {
          // If all contributors list is in the database, it simply returns that as a resolved promise
          resolve(allContributors);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}

// EXPORTS
module.exports = {
  storeAllContribsInDb: storeAllContribsInDb
};
