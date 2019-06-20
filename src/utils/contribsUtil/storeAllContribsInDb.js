let fetchRepoContributorsUtil = require('./fetchRepoContribsUtil')
let model_utils = require('../../models/utils')

// This runs at the very start of page load and stores all the repositories and all the
// contributors in the database on initial page load
function storeAllContribsInDb(org) {
	let AllContributors = [];
	let promises = [];
	var contributorSet = new Set([]);
	return new Promise((resolve, reject) => {
		model_utils.getItem('allContributors').then((allContributors) => {
		  // If all contributors list is not in the database, it makes a fresh call to Github API
		  if(allContributors == null || allContributors == undefined || allContributors.length == 0) {
			  return model_utils.getItem('repos').then((res) => {
				let splicedRepos = res.splice(0, 20);
				splicedRepos.map(function mappingToEachRepo(Repo, i) {
				  let promise = fetchRepoContributorsUtil.fetchRepoContributorsUtil(org, Repo)
								.then(function gotRepoContributorsInStorage(contributors) {
								  if(contributors!=undefined && contributors.length>0) {
									contributors.map((contributor, i)=> {
									  if(!contributorSet.has(contributor.login)) {
										contributorSet.add(contributor.login);
										AllContributors.push(contributor);
									  }
									})
								  }
								});
				  promises.push(promise);
				});
				return Promise.all(promises)
						.then(()=> {
							// Storing array containing all the contributors' list across 20 most active
							// repos to database
							model_utils.setItem('allContributors', AllContributors);
							// Saves current time in epoch, used for flushing out the stored data
							// after 24 hours
							let currentTime = (new Date).getTime();
							model_utils.setItem('allContributorsExpiry', currentTime);
							resolve(AllContributors);
						})
			  })
		  }
		  // If all contributors list is in the database, it simply returns that as a resolved promise 
		  else {
			resolve(allContributors);
		  }
		})
	  });
  }

  


// EXPORTS
module.exports = {
	storeAllContribsInDb: storeAllContribsInDb
}