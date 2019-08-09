// Import required modules
let model_utils = require('../../src/models/utils')
let fetchRepoContributorsUtil = require('../../src/utils/contribsUtil/fetchRepoContribsUtil')
let storeAllContribsInDb = require('../../src/utils/contribsUtil/storeAllContribsInDb')
const when = require('jest-when')
let { getFakeContribsData, getReposList  } = require('../utils')

describe('storeAllContribsInDb.js', () => {
	let org;

	beforeAll(() => {
		org = "publiclab";

		// Fake data
		let repos = getReposList();
		let contribs = getFakeContribsData();

		// Other functions are mocked
		fetchRepoContributorsUtil.fetchRepoContributorsUtil = jest.fn(() => Promise.resolve(contribs))
		
		// Database operations mocked
		// 1. setItem function is mocked
		model_utils.setItem = jest.fn(() => {return true})

		// 2. getItem function is mocked and its behavior depends on the parameter it is called with
		model_utils.getItem = jest.fn();
		when.when(model_utils.getItem)
		.calledWith("allContributors")
		.mockReturnValueOnce(() => Promise.resolve(null))
		
		.calledWith("repos")
		.mockReturnValueOnce(() => Promise.resolve(repos))
	})


	// ====================== TEST ========================

	it('stores and returns contributors for all the repos', () => {
		return storeAllContribsInDb.storeAllContribsInDb(org)
		.then((data) => {
			expect(data).toBeDefined();
			expect(Array.isArray(data)).toBe(true);
			expect(data.length).toBeGreaterThan(0);
		})
	})
})