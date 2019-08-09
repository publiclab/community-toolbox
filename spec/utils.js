function getReposList() {
	return [
		"repo1",
		"repo2",
		"repo3"
	];
}

function getFakeContribsData() {
	return [
		{
			"author": { "login": "name1" },
			"commit": {
				"committer": { "date": "2019-08-06T19:44:08Z" }
			}
		},
		{
			"author": { "login": "name2" },
			"commit": {
				"committer": { "date": "2019-07-01T19:16:19Z" }
			}
		}
	];
}



module.exports = {
	getFakeContribsData: getFakeContribsData,
	getReposList: getReposList,
}