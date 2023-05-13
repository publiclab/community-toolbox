const modelUtils = require('../models/utils');


function getOrgWideIssues(org) {
    let totalPromises = [];
    let staleIssues = [];
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
            let pages = 5; // we take 5 to stay under API limit
            if(issues!=undefined && issues!=null) {
                return issues;
            }

            for(let i=1;i<=pages;i++) {
              let curr = fetch(`https://api.github.com/search/issues?q=is%3Aopen+org%3A${org}+page%3A${i}`)
                            .then((data) => {
                                if(data.status=='200') {
                                    return data.json();
                                }else {
                                    throw "Couldn't fetch issues";
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
                            .catch((err) => {
                                throw err;
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
    .catch((err) => {
        throw err;
    })
}

function getStaleIssues(org, repo) {
    return getOrgWideIssues(org, repo)
    .then((issues) => {
        if(issues!=undefined && issues!=null) {
            return issues;
        }

        for (let i = 1; i <= pages; i++) {
          // eslint-disable-next-line no-undef
          const curr = fetch(
            `https://api.github.com/search/issues?q=is%3Aopen+org%3A${org}+page%3A${i}`
          )
            .then(data => {
              // eslint-disable-next-line eqeqeq
              if (data.status == '200') {
                return data.json();
              } else {
                throw new Error("Couldn't fetch issues");
              }
            })
            .then(function (data) {
              if (data != null && data !== undefined) {
                data.items.map(function mappingToIssues (issue, index) {
                  const dateLastUpdated = new Date(`${issue.updated_at}`);
                  const lastDate = dateLastUpdated.getTime();
                  const today = new Date().getTime();
                  if (
                    Math.ceil(Math.abs(today - lastDate) / (1000 * 3600 * 24)) >
                    10
                  ) {
                    staleIssues.push(issue);
                  }
                });
              }
            })
            .catch(err => {
              throw err;
            });

          totalPromises.push(curr);
        }

        return Promise.all(totalPromises).then(() => {
          const now = new Date().getTime();
          modelUtils.setItem('staleIssues', staleIssues);
          modelUtils.setItem('staleIssues-time', now);
          return staleIssues;
        });
      });
    })
    .catch(err => {
      throw err;
    });
}

function getRepoStaleIssues(org, repo) {
    let  issueArray = [];
    return getStaleIssues(org, repo)
    .then((issues) => {
        if(issues!=undefined && issues!=null) {
            return issues;
        }
    }).then((issues)=>{
            issues.map(function mappingToIssues(issue, index) {
                let str = issue.repository_url;
                let n = str.search(repo);
                if(n!=-1 & n!=undefined) {
                    if(!issueArray.includes(issue)){
                        issueArray.push(issue);
                    }
                }
            })
            model_utils.setItem('stale-issues-'+repo,issueArray);
            return issueArray;        
    })
    .catch((err) => {
        throw err;
    })
}



module.exports = {
    getOrgWideIssues: getOrgWideIssues,
    getStaleIssues: getStaleIssues,
    getRepoStaleIssues: getRepoStaleIssues
}
