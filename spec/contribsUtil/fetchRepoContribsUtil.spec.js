// Import required modules
let fetchAllRepoContribs = require('../../src/utils/contribsUtil/fetchAllRepoContribs')
let fetchRepoContribs = require('../../src/utils/contribsUtil/fetchRepoContribs')
let fetchRepoContributorsUtil = require('../../src/utils/contribsUtil/fetchRepoContribsUtil')


describe('fetchRepoContribsUtil.js', () => {
	let org, repo;

	beforeAll(() => {
		// Initialize variables
		org = "publiclab";

		// Other functions are mocked here
		fetchAllRepoContribs.fetchAllRepoContribs = jest.fn(() => {return true})
		fetchRepoContribs.fetchRepoContribs = jest.fn(() => {return true})
	})


	// ====================== TESTS ========================

	it('directs to appropriate to function - for plots2', () => {
		repo = "plots2";

		return fetchRepoContributorsUtil.fetchRepoContributorsUtil(org, repo)
		.then((data) => {
			expect(data).toBeDefined();
			expect(fetchAllRepoContribs.fetchAllRepoContribs).toHaveBeenCalled();
		})
	})


	it('directs to appropriate to function - for repos other than plots2', () => {
		repo = "plotsbot";
		
		return fetchRepoContributorsUtil.fetchRepoContributorsUtil(org, repo)
		.then((data) => {
			expect(data).toBeDefined();
			expect(fetchRepoContribs.fetchRepoContribs).toHaveBeenCalled();
		})
	})

})