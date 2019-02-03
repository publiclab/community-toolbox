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
            });
            // Storing the repos in localStorage
            localStorage.setItem('repos', JSON.stringify(repos));
            return(repos);
          });
  }


// EXPORTS
module.exports = {
    getAllRepos: getAllRepos,
}