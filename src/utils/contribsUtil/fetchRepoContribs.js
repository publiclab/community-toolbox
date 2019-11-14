const SimpleApi = require('github-api-simple');
const api = new SimpleApi();
const modelUtils = require('../../models/utils');

// This utility helps us in getting CONTRIBUTORS for a particular repository
function fetchRepoContribs (org, repo) {
  // This array is used to store the contributors from all of the repositories
  const contributorsArray = [];

  return api.Repositories.getRepoContributors(org, repo, {
    method: 'GET',
    qs: { sort: 'pushed', direction: 'desc', per_page: 100 }
  })
    .then(function gotRepoContributors (contributors) {
      if (
        contributors !== undefined &&
        (contributors != null || contributors.length > 0)
      ) {
        contributors.map((contributor, i) =>
          contributorsArray.push(contributor)
        );
      }
    })
    .then(() => {
      const now = new Date().getTime();
      modelUtils.setItem(repo, contributorsArray);
      modelUtils.setItem(`${repo}Expiry`, now);
      return contributorsArray;
    })
    .catch(err => {
      throw err;
    });
}

// EXPORTS
module.exports = {
  fetchRepoContribs: fetchRepoContribs
};
