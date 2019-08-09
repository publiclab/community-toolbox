// Import required modules
let main = require('../../src/utils/contribsUtil/main')
let storeAllContribsInDb = require('../../src/utils/contribsUtil/storeAllContribsInDb')
let fetchRepoContribsUtil = require('../../src/utils/contribsUtil/fetchRepoContribsUtil')
let { getFakeContribsData  } = require('../utils')

describe('util/contribsUtil/main.js', () => {
	let org, repo;

	beforeAll(() => {
		org = "publiclab";
		repo = "plots2";
		
		// Fake data
		let contribsFakeData = getFakeContribsData();
		
		// Utility functions are mocked
		storeAllContribsInDb.storeAllContribsInDb = jest.fn(() => Promise.resolve(contribsFakeData))
		fetchRepoContribsUtil.fetchRepoContributorsUtil = jest.fn(() => Promise.resolve(contribsFakeData))
	})


	// ====================== TESTS ========================

	it('testing fetchAllContribsInDb', () => {
		return main.fetchAllContribsInDb(org)
		.then((data) => {
			expect(data).toBeDefined();
			expect(Array.isArray(data)).toBe(true);
			expect(data.length).toBeGreaterThan(0);
		})
	})


	it('testing repoContribsUtil', () => {
		return main.repoContribsUtil(org, repo)
		.then((data) => {
			expect(data).toBeDefined();
			expect(Array.isArray(data)).toBe(true);
			expect(data.length).toBeGreaterThanOrEqual(0);
		})
	})

})