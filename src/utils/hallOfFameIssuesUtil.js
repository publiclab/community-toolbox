let model_utils = require('../models/utils')

function getOrgWideIssues(org) {
    let totalPromises = [];
    let hallOfFameIssues = [];
    return model_utils.getItem("hallOfFameIssues").then((issues) => {
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
                            .catch((err) => {
                                throw err;
                            })

              totalPromises.push(curr);
            }

            return Promise.all(totalPromises).then(()=> {
                model_utils.setItem("hallOfFameIssues", hallOfFameIssues);
                return hallOfFameIssues;
            })
        })
    .catch((err) => {
        throw err;
    })
}



function gethallOfFameIssues(org, repo) {
    return getOrgWideIssues(org, repo)
    .then((issues) => {
        if(issues!=undefined && issues!=null) {
            return issues;
        }
    })
    .catch((err) => {
        throw err;
    })
}





module.exports = {
    getOrgWideIssues: getOrgWideIssues,
    gethallOfFameIssues: gethallOfFameIssues
}