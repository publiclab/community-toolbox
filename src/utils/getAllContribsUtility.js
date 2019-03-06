// Fetches all the publiclab's repositories
function getAllRepos(org) {

  // This array is used to store all the repositories fetched from Github
  let repos = [];

  return fetch(`https://api.github.com/users/${org}/repos?sort=pushed&direction=desc&per_page=100`)
          .then( (data) => data.json() )
          .then( (results) => {
            results.map( (repo, index) => repos[index] = repo.name );
            // Storing the repos in localStorage
            localStorage.setItem('repos', JSON.stringify(repos));
            return(repos);
          });
  }


// EXPORTS
module.exports = {
    getAllRepos: getAllRepos,
}