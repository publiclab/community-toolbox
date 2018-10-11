

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

    return new Promise(function handleRepoFetch(resolve, reject) {
      fetch(`https://api.github.com/orgs/${org}/repos`, {'headers': { "Content-Type": "application/x-www-form-urlencoded", "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36" }})
      .then(function gotRequestResponse(response) {
        if (response.status == "200") {
          return response.json();
        }
      })
      .then(function gotResponseInJson(res) {
        // Maps to each repo and stores it in the array
        res.map(function mapToEachRepo(item, i) {
          repos[i] = item.name;
        });
        // Stores all publiclab's repos to localStorage (only first 30 repos yet)
        localStorage.setItem('repos', JSON.stringify(repos));

        resolve(repos);
      })
    });
    
  }

  // Fetches all the UNIQUE contributors from all the publiclab's repos
  // and stores them in localStorage in the form of an array
  function getAllContributorsInStorage(org, repos) {
    var contributorSet = new Set([]);
    var myArr = [];

    var promises = repos.map(function mapToEachRepo(repo, i) {
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