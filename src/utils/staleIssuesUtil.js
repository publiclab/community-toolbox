let model_utils = require('../models/utils')

let repos = model_utils.getItem('repos')


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
    }).then((issues)=>{
        for (i=0; i<repos.length; i++) {
            issues.items.map(function mappingToIssues(issue, index) {
                let str = issue.repository_url;
                let n = str.search(repos[i]);
                if(n!=-1 & n!=undefined) {
                    model_utils.setItem(repos[i],issue);
                }
            })
            
        };
    })
    .catch((err) => {
        throw err;
    })
}





module.exports = {
    getOrgWideIssues: getOrgWideIssues,
    getStaleIssues: getStaleIssues
}
