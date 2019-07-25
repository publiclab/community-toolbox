let fetchAllRecentMonthContribs = require('./fetchAllRecentMonthContribs')
let fetchRepoUtil = require('../repoUtil/fetchRepoUtil')
let model_utils = require('../../models/utils')


// Stores all the Recent Contributors in the database
function storeAllRecentContribsInDb(org, repo) {
	// We make queryTime 1 month behind the current time, to pass it as query in the request
	let d = (new Date);
	d.setDate(d.getDate() - 30);
	let queryTime = d.toISOString();
	return model_utils.getItem('repos')
	.then((repos) => {
		return model_utils.getItem('recent-present').then((result)=> {
		if(result!=null && result!=undefined) {
			return result;
		}
		else {
			if(repos!=null || repos!=undefined) {
				return fetchAllRecentMonthContribs.fetchAllRecentMonthContribs(org, repos, queryTime)
				.then((result) => {
					model_utils.setItem('recent-present', 'true');
					return result;
				})
				.catch((err) => {
					throw err;
				})
			} else {
				fetchRepoUtil.getAllRepos(org)
				.then((repos) => {
					if(repos!=null || repos!=undefined) {
						return fetchAllRecentMonthContribs.fetchAllRecentMonthContribs(org, repos, queryTime)
						.then((result) => {
							model_utils.setItem('recent-present', 'true');
							return result;
						})
						.catch((err) => {
							throw err;
						})
					}
			  	});
			}
		}
		});
	})
	.catch((err) => {
		throw err;
	})
}



// EXPORTS
module.exports = {
	storeAllRecentContribsInDb: storeAllRecentContribsInDb
}
