// These helper functions provide fake data for tests

function getFakeReposList() {
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


function getFakeIssuesList() {
	return {
		"items": [
			{ "updated_at": "2019-08-03T22:34:02Z", "repository_url" : "https://api.github.com/repos/publiclab/plots2" },
			{ "updated_at": "2019-07-26T17:27:09Z", "repository_url" : "https://api.github.com/repos/publiclab/plots2" },
	   		{ "updated_at": "2018-01-23T20:00:10Z", "repository_url" : "https://api.github.com/repos/publiclab/image-sequencer" },
			{ "updated_at": "2019-08-03T18:56:08Z", "repository_url" : "https://api.github.com/repos/publiclab/image-sequencer" },
			{ "updated_at": "2019-07-08T23:37:36Z", "repository_url": "https://api.github.com/repos/publiclab/leaflet-blurred-location" }
   		]
	}
}



module.exports = {
	getFakeContribsData: getFakeContribsData,
	getFakeReposList: getFakeReposList,
	getFakeIssuesList: getFakeIssuesList
}