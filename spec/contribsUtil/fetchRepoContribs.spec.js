// Import required modules
let SimpleApi = require("github-api-simple")
let api = new SimpleApi()
let model_utils = require('../../src/models/utils')
let { fetchRepoContribs } = require('../../src/utils/contribsUtil/fetchRepoContribs')
let { getFakeContribsData  } = require('../utils')

describe('fetchRepoContribs.js', () => {
	let org, repo;

	// Fake data
	let contribs = getFakeContribsData();

	beforeAll(() => {
		org = "publiclab";
		repo = "plots2";

		// Database operations are mocked
		model_utils.setItem = jest.fn(() => {return true})
		// Other functions are mocked
		api.Repositories.getRepoContributors = jest.fn(() => Promise.resolve(contribs))
	})


	// ====================== TESTS ========================

	it('fetches and stores contributors for specific repo', () => {
		return fetchRepoContribs(org, repo)
		.then((data) => {
			expect(data).toBeDefined();
			expect(Array.isArray(data)).toBe(true);
			expect(data.length).toBeGreaterThanOrEqual(0);
			expect(data[0].author.login).toBeDefined();
		})
	})

})