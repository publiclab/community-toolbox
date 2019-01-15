var SimpleApi = require("github-api-simple")
var api = new SimpleApi();
var parse = require('parse-link-header');

// This is a utility function which decides whether to a single request for fetching
// each repo's contributors or multiple ones.
function fetchRepoContributorsUtil(org, repo) {
  return new Promise((resolve, reject) => {
    if(repo === 'plots2') {
      resolve(fetchAllRepoContributors(org, repo));
    }else {
      resolve(fetchRepoContributors(org, repo));
    }
  })
}


// This utility helps us in getting ALL THE CONTRIBUTORS for a particular repository
function fetchAllRepoContributors(org, repo) {
    // This array is used to store the contributors from all of the repositories
    let contributorsArray = [];

    return api.Repositories
           .getRepoContributors(org, repo, {method: "HEAD", qs: { sort: 'pushed', direction: 'desc', per_page: 100 } })
           .then(function gotContribData(contribData) {
             var headers = contribData;
             if (headers.hasOwnProperty("link")) {
                 var parsed = parse(headers['link']);
                 totalPages = parseInt(parsed.last.page);
             } else {
                 totalPages = 1;
             }
             return totalPages;
           })
           .then(function gotTotalPages(totalPages) {
              // This array is used to store all of the promises
              let promises = [];

              for(let i = 1; i <= totalPages; i++) {
                var currentPromise = api.Repositories
                                      .getRepoContributors(org, repo, { method:"GET", qs: { sort: 'pushed', direction: 'desc', per_page: 100, page:i } })
                                      .then(function gotRepoContributors(contributors) {
                                        if (contributors!=undefined && (contributors != null || contributors.length > 0)) {
                                            contributors.map((contributor, i) => contributorsArray.push(contributor));
                                        }
                                      });
                // Push currentPromise to promises array
                promises.push(currentPromise);
              }

              // Waits for all of the promises to resolve first, sets localStorage after that...
              return Promise.all(promises)
                    .then(()=> {
                      let now = (new Date).getTime();
                      localStorage.setItem('repoContributors', JSON.stringify(contributorsArray));
                      localStorage.setItem('repoContributorsExpiry', now);
                      return contributorsArray;
                    });
           });
  }




// This utility helps us in getting CONTRIBUTORS for a particular repository
function fetchRepoContributors(org, repo) {
  // This array is used to store the contributors from all of the repositories
  let contributorsArray = [];

  return api.Repositories
            .getRepoContributors(org, repo, { method:"GET", qs: { sort: 'pushed', direction: 'desc', per_page: 100 }})
            .then(function gotRepoContributors(contributors) {
              if (contributors!=undefined && (contributors != null || contributors.length > 0)) {
                contributors.map((contributor, i) => contributorsArray.push(contributor));
              }
            })
            .then(() => {
              let now = (new Date).getTime();
              localStorage.setItem('repoContributors', JSON.stringify(contributorsArray));
              localStorage.setItem('repoContributorsExpiry', now);
              return contributorsArray;
            })

}



// EXPORTS
module.exports = {
    fetchAllRepoContributors: fetchAllRepoContributors,
    fetchRepoContributors: fetchRepoContributors,
    fetchRepoContributorsUtil: fetchRepoContributorsUtil,
}