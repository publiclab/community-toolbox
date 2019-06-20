let SimpleApi = require("github-api-simple")
let api = new SimpleApi()
let model_utils = require('../../models/utils')


// This utility helps us in getting CONTRIBUTORS for a particular repository
function fetchRepoContribs(org, repo) {
	// This array is used to store the contributors from all of the repositories
	let contributorsArray = [];
  
	return api.Repositories
			  .getRepoContributors(org, repo, { method:"GET", qs: { sort: 'pushed', direction: 'desc', per_page: 100 }})
			  .then(function gotRepoContributors(contributors) {
				if (contributors!=undefined && (contributors != null || contributors.length > 0)) {
				  contributors.map((contributor, i) => contributorsArray.push(contributor));
				}
			  })
			  .then(() => {
				let now = (new Date).getTime();
				model_utils.setItem(repo, contributorsArray);
				model_utils.setItem(`${repo}Expiry`, now);
				return contributorsArray;
			  })
  }

  


// EXPORTS
module.exports = {
	fetchRepoContribs: fetchRepoContribs
}