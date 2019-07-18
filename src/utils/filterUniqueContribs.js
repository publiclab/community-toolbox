// Given a list of commits which contains repeated commiters, this function extracts
// a list of unique commiters and returns that
function filterUniqueContribs(data) {
	let commitersSet = new Set([]);
	let result = [];

	data.map(function mappingToCommits(commit, i) {
		if(commit.author!=null) {
		    if(!commitersSet.has(commit.author.login)) {
		        commitersSet.add(commit.author.login);
				result.push(commit);
			}
		}
	});

	return result;
}


module.exports = {
	filterUniqueContribs: filterUniqueContribs,
}