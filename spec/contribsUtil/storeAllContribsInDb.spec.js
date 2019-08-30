// Import required modules
let model_utils = require('../../src/models/utils')
let fetchRepoContributorsUtil = require('../../src/utils/contribsUtil/fetchRepoContribsUtil')
let storeAllContribsInDb = require('../../src/utils/contribsUtil/storeAllContribsInDb')
const { when } = require('jest-when')
let { getFakeContribsData, getFakeReposList  } = require('../helper')

describe('storeAllContribsInDb.js', () => {
	let org;
	let repos, contribs;

	beforeAll(() => {
		// Intialize variables
		org = "publiclab";
		repos = getFakeReposList();
		contribs = getFakeContribsData();

		// Database operations are mocked

		// 1. setItem function is mocked
		model_utils.setItem = jest.fn(() => {return true})

		// 2. getItem function is mocked and its behavior depends on the parameter it is called with
		model_utils.getItem = jest.fn();
		when(model_utils.getItem)
		.calledWith("allContributors")
		.mockReturnValueOnce(() => Promise.resolve(null))
		.calledWith("repos")
		.mockReturnValueOnce(() => Promise.resolve(repos))
		
		// Other functions are mocked
		fetchRepoContributorsUtil.fetchRepoContributorsUtil = jest.fn(() => Promise.resolve(contribs))
	
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