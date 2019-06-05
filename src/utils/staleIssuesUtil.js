let model_utils = require('../models/utils')

function getOrgWideIssues(org) {
    let totalPromises = [];
    let staleIssues = [];
    let totalPages;
    let currentTime = (new Date).getTime();
    return model_utils.getItem("staleIssues-time").then((time) => {
        if(time!=undefined && time!=null && (time-currentTime)/1000 >= 86400) {
            return Promise.all([model_utils.deleteItem("staleIssues"), model_utils.deleteItem("staleIssues-time")])
                .then(()=> {
                    return true;
                })
        }
    })
    .then(() => {
        return model_utils.getItem("staleIssues").then((issues) => {
            
            if(issues!=undefined && issues!=null) {
                return issues;
            }

            return fetch(`https://api.github.com/search/issues?q=is%3Aopen+org%3A${org}`, {qs: { sort: 'pushed', direction: 'desc', per_page: 100 } })
              .then((data) => {
                if(data.status=='200') {
                  return data.json();
                }
              })
              .then(function (data) {
                let headers = data;
                if (headers.hasOwnProperty("link")) {
                  let parsed = parse(headers['link']);
                  if(parsed.last.page!=undefined) {
                    totalPages = parseInt(parsed.last.page);
                  }
                } 
                else {
                  totalPages = 1;
                }
                  return totalPages;
              })
              .then(function (totalPages) {
                
                for(let i=1;i<=totalPages;i++) {
                  let curr = fetch(`https://api.github.com/search/issues?q=is%3Aopen+org%3Apubliclab+page%3A${i}`)
                              .then((data) => {
                                if(data.status=='200') {
                                  return data.json();
                                }
                              })
                              .then(function (data) {
                                if(data!=null && data!=undefined) {
                                  
                                  data.items.map(function mappingToIssues(issue, index) {
                                      let dateLastUpdated = new Date(`${issue.updated_at}`);
                                      let lastDate = dateLastUpdated.getTime();
                                      let today = (new Date).getTime();
                                      if(Math.ceil(Math.abs(today - lastDate) / (1000*3600*24)) > 10 ) {
                                          staleIssues.push(issue);
                                      }
                                  })
                                }
                              })
        
        
                  totalPromises.push(curr);
                }
                
                return Promise.all(totalPromises).then(()=> {
                    let now = (new Date).getTime();
                    model_utils.setItem("staleIssues", staleIssues);
                    model_utils.setItem("staleIssues-time", now);
                    return staleIssues;
                })
              })



        })
    })
}



function getStaleIssues(org, repo) {
    if(repo==="all") {
        return getOrgWideIssues(org, repo).then((issues) => {
            if(issues!=undefined && issues!=null) {
                return issues;
            }
        })
    }else {
        return getOrgWideIssues(org, repo).then((issues) => {
            let issuesForRepo = [];
            issues.map((issue, i) => {
                let repoName = issue['repository_url'].split("/");
                repoName = repoName[repoName.length - 1];
                if(repoName===repo) {
                    issuesForRepo.push(issue);
                }
            })
            return issuesForRepo;
        })
    }
}





module.exports = {
    getOrgWideIssues: getOrgWideIssues,
    getStaleIssues: getStaleIssues
}