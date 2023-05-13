/*
options = {
    "since" : {
        "date" : "yyyy-mm-dd",
        "time" : "hh:mm:ss"
        },
    "until" : {
        "date" : "yyyy-mm-dd",
        "time" : "hh:mm:ss"
        }
}
*/

// get list of contributors to a repo in a given time frame
function getRepoContributors(username, repo, options){
    commits = getCommitsInRange(username, repo, options);   
    let result = [];
    let lookup = {};
    for (let i=0; i<commits.length; i++){
        let item = commits[i]["commit"]["author"]["name"];
        let name = item;
        if(!(name in lookup)){
            lookup[name] = 1;
            result.push(name);
        }
    }
  }
  return result;
}

// Get commit log of a repo in a given time frame by using Github API
// https://developer.github.com/v3/repos/commits/#list-commits-on-a-repository
function getCommitsInRange (username, repo, options) {
  const url =
    'https://api.github.com/repos/' +
    username +
    '/' +
    repo +
    '/commits?since=' +
    options.since.date +
    'T' +
    options.since.time +
    'Z' +
    '&until=' +
    options.until.date +
    'T' +
    options.until.time +
    'Z';
  const result = httpGet(url);
  return JSON.parse(result);
}

// send GET request
function httpGet(url){
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

module.exports = {
  getRepoContributors: getRepoContributors
};
