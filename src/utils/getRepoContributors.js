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
    var result = [];
    var lookup = {};
    for (var i=0; i<commits.length; i++){
        var item = commits[i]["commit"]["author"]["name"];
        var name = item;
        if(!(name in lookup)){
            lookup[name] = 1;
            result.push(name);
        }
    }
    return(result);
}

// Get commit log of a repo in a given time frame by using Github API
// https://developer.github.com/v3/repos/commits/#list-commits-on-a-repository
function getCommitsInRange(username, repo, options){
    url = "https://api.github.com/repos/"+username+"/"+repo+"/commits?since=" + options["since"]["date"]+ "T" + options["since"]["time"] + "Z"+"&until="+options["until"]["date"]+"T"+ options["until"]["time"] + "Z";
    result = httpGet(url);
    return JSON.parse(result);
}

// send GET request
function httpGet(url){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

module.exports = {
  getRepoContributors: getRepoContributors
}
