let SimpleApi = require("github-api-simple")
let api = new SimpleApi()
let model_utils = require('../../models/utils')
let parse = require('parse-link-header')

// This utility helps us in getting all the contributors for a particular repository
function fetchAllRepoContribs(org, repo) {
    // This array is used to store the contributors from all of the repositories
    let contributorsArray = [];

    return api.Repositories
          .getRepoContributors(org, repo, {method: "HEAD", qs: { sort: 'pushed', direction: 'desc', per_page: 100 } })
          .then(function gotContribData(contribData) {
            let headers = contribData;
            if (headers.hasOwnProperty("link")) {
              let parsed = parse(headers['link']);
              if(parsed.last.page!=undefined) {
                totalPages = parseInt(parsed.last.page);
              }
            } else {
              totalPages = 1;
            }
            return totalPages;
          })
          .then(function gotTotalPages(totalPages) {
            // This array is used to store all of the promises
            let promises = [];

            for(let i = 1; i <= totalPages; i++) {
              let currentPromise = api.Repositories
                                  .getRepoContributors(org, repo, { method:"GET", qs: { sort: 'pushed', direction: 'desc', per_page: 100, page:i } })
                                  .then(function gotRepoContributors(contributors) {
                                    if (contributors!=undefined && (contributors != null || contributors.length > 0)) {
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
              .then(()=> {
                let now = (new Date).getTime();
                  model_utils.setItem(repo, contributorsArray);
                  model_utils.setItem(`${repo}Expiry`, now);
                  return contributorsArray;
              });
          })
          .catch((err) => {
            throw err;
          })
}




// EXPORTS
module.exports = {
	fetchAllRepoContribs: fetchAllRepoContribs
}