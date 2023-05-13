const SimpleApi = require('github-api-simple');
const api = new SimpleApi();
const modelUtils = require('../../models/utils');
const parse = require('parse-link-header');

// This utility helps us in getting all the contributors for a particular repository
function fetchAllRepoContribs (org, repo) {
  // This array is used to store the contributors from all of the repositories
  const contributorsArray = [];

  return api.Repositories
    .getRepoContributors(org, repo, { method: 'HEAD', qs: { sort: 'pushed', direction: 'desc', per_page: 100 } })
    .then(function gotContribData (contribData) {
      const headers = contribData;
      // eslint-disable-next-line no-prototype-builtins
      if (headers.hasOwnProperty('link')) {
        const parsed = parse(headers.link);
        if (parsed.last.page !== undefined) {
          // eslint-disable-next-line no-undef
          totalPages = parseInt(parsed.last.page);
        }
      } else {
        // eslint-disable-next-line no-undef
        totalPages = 1;
      }
    })
    .then(function gotTotalPages (totalPages) {
      // This array is used to store all of the promises
      const promises = [];

      for (let i = 1; i <= totalPages; i++) {
        const currentPromise = api.Repositories
          .getRepoContributors(org, repo, { method: 'GET', qs: { sort: 'pushed', direction: 'desc', per_page: 100, page: i } })
          .then(function gotRepoContributors (contributors) {
            if (contributors !== undefined && (contributors !== null || contributors.length > 0)) {
              contributors.map((contributor, i) => contributorsArray.push(contributor));
            }
          })
          .catch((err) => {
            throw err;
          });
        // Push currentPromise to promises array
        promises.push(currentPromise);
      }

      // Waits for all of the promises to resolve first, sets localStorage after that...
      return Promise.all(promises)
        .then(() => {
          const now = (new Date()).getTime();
          modelUtils.setItem(repo, contributorsArray);
          modelUtils.setItem(`${repo}Expiry`, now);
          return contributorsArray;
        });
    })
    .catch((err) => {
      throw err;
    });
}

// EXPORTS
module.exports = {
  fetchAllRepoContribs: fetchAllRepoContribs
};
