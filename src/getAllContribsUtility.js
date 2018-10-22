

    var SimpleApi = require("github-api-simple")
    var api = new SimpleApi();
    var ui = require('./ui');
    var parse = require('parse-link-header');


  // Fetches all the contributors for a particular repository
  function fetchRepoContributors(org, repo) {
    // This array is used to hold all the contributors of a repo
    var arr = [];

    return api.Repositories
    .getRepoContributors(org, repo, {method: "HEAD", qs: { sort: 'pushed', direction: 'desc', per_page: 100 } })
    .then(function gotContribData(contribData) {
      var headers = contribData;
      if (headers.hasOwnProperty("link")) {
          var parsed = parse(headers['link']);
          var totalPages = parseInt(parsed.last.page);
      } else {
          var totalPages = 1;
      }
      return totalPages;
    })
    .then(function gotTotalPages(totalPages) {
      // This array is used to collect all the promises so that 
      // we can wait for all of them to finish first...
      let promises = [];
      
      for(let i = 1; i <= totalPages; i++) {
        var currentPromise = api.Repositories
                              .getRepoContributors(org, repo, { method:"GET", qs: { sort: 'pushed', direction: 'desc', per_page: 100, page:i } })
                              .then(function gotContributorsOnParticularPage(contributors) {
                                if (contributors!=undefined && (contributors != null || contributors.length > 0)) {
                                    contributors.map((contributor, i) => arr.push(contributor));
                                }
                              });
        // Push currentPromise to promises array
        promises.push(currentPromise);
      }
      // Waits for all the promises to resolve first, returns the array after that...
      return Promise.all(promises)
            .then(()=> {
              return arr;
            });
    })
  }



  // Fetches all the publiclab's repositories
  function getAllRepos(org) {

    // This array is used to store all the repositories fetched from Github
    let repos = [];

    return fetch('https://api.github.com/users/publiclab/repos?sort=pushed&direction=desc&per_page=100')
            .then(function gotRepos(data) {
              if(data.status=='200') {
                return data.json();
              }
            })
            .then(function mapToEachRepo(results) {
              results.map(function mappingToEachRepo(repo, index) {
                return repos[index] = repo.name;
              })
              // Stores all of the Publiclab's repos to localStorage
              localStorage.setItem('repos', JSON.stringify(repos));
              
              return(repos);
            });
  }

  // Fetches all the UNIQUE contributors from all the publiclab's repos
  // and stores them in localStorage in the form of an array
  function getAllContributorsInStorage(org, repos) {
    var contributorSet = new Set([]);
    var myArr = [];
    // We take only first 20 repos to stay under API quota
    var splicedRepos = repos.splice(0,20);
    var promises = splicedRepos.map(function mapToEachRepo(repo, i) {
                    return fetchRepoContributors(org, repo)
                            .then(function gotContribsForParticularRepo(repoContributors) {
                                if (repoContributors!=undefined && repoContributors.length>0) {
                                  // Maps to each contributor and stores it in the array
                                  // if its not in there yet
                                  repoContributors.map((contributor, i) => {
                                      if(!contributorSet.has(contributor.login)) {
                                      contributorSet.add(contributor.login);
                                      myArr.push(contributor);
                                      }
                                  });
                                }
                                return(true);
                            });
                  });

      // Waits for all the promises to resolve, in order to make sure that
      // myArr contains results from all of the promises
      return Promise.all(promises)
        .then(() => {
          // Stores all unique contributors info to localStorage
          localStorage.setItem('contributors', JSON.stringify(myArr));
          return myArr;
        });
  }



// EXPORTS
module.exports = {
    getAllContributorsInStorage: getAllContributorsInStorage,
    getAllRepos: getAllRepos,
}