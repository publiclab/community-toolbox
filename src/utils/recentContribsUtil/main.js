let getContribsLastMonth = require('./getContribsLastMonth')
let getContribsLastWeek = require('./getContribsLastWeek')
let storeAllRecentContribsInDb = require('./storeAllRecentContribsInDb')



function fetchContribsLastMonth(org, repo) {
    return getContribsLastMonth.getContribsLastMonth(org, repo)
    .then((contribs) => {
        return contribs;
    })
    .catch((err) => {
        console.log("finally throwing");
        throw err;
    })
}

function fetchContribsLastWeek(org, repo) {
    return getContribsLastWeek.getContribsLastWeek(org, repo)
    .then((contribs) => {
        return contribs;
    })
    .catch((err) => {
        console.log("finally throwing");
        throw err;
    })
}

function fetchAllRecentContribsInDb(org, repo) {
    return storeAllRecentContribsInDb.storeAllRecentContribsInDb(org, repo)
    .then((response) => {
      return response;
    })
    .catch((err) => {
        console.log("finally throwing");
        throw err;
    })
}



// EXPORTS
module.exports = {
    fetchContribsLastMonth: fetchContribsLastMonth,
    fetchContribsLastWeek: fetchContribsLastWeek,
    fetchAllRecentContribsInDb: fetchAllRecentContribsInDb
}
