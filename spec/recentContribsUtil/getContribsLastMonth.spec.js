// Import required modules
let model_utils = require('../../src/models/utils')
let fetchAllRecentMonthContribs = require('../../src/utils/recentContribsUtil/fetchAllRecentMonthContribs')
let fetchRecentMonthContribs = require('../../src/utils/recentContribsUtil/fetchRecentMonthContribs')
let {getContribsLastMonth} = require('../../src/utils/recentContribsUtil/getContribsLastMonth')
const { when } = require('jest-when')
let { getFakeContribsData, getFakeReposList } = require('../helper')


describe('getContribsLastMonth.js', () => {
	let org, repo, forMonths;
	let repos, contribs;

	beforeAll(() => {
		// Initialize variables
		org = "publiclab";
		repo = "plots2";
		forMonths = 6;
		repos = getFakeReposList();
		contribs = getFakeContribsData();

		
		// Database operations are mocked
		
		// 1. getItem function is mocked and its behavior depends on the parameter it is called with
		model_utils.getItem = jest.fn();
		when(model_utils.getItem)
		.calledWith("repos")
		.mockReturnValue(() => Promise.resolve(repos))
		
		.calledWith(`recent-${repo}-${forMonths}-month-expiry`)
		.mockReturnValueOnce(() => Promise.resolve(null))
		.mockReturnValueOnce(() => Promise.resolve(null))
		
		.calledWith(`recent-${repo}-${forMonths}-month-commits`)
		.mockReturnValueOnce(() => Promise.resolve(null))
		.mockReturnValueOnce(() => Promise.resolve(contribs))
		
		// Other utility functions are mocked
		fetchAllRecentMonthContribs.fetchAllRecentMonthContribs = jest.fn(() => Promise.resolve(contribs))
		fetchRecentMonthContribs.fetchRecentMonthContribs = jest.fn(() => Promise.resolve(contribs))
	})


	// ====================== TESTS ========================

	it('fetches and returns contributors for desired months from the API', () => {
		return getContribsLastMonth(org, repo, forMonths)
		.then((data) => {
			expect(data).toBeDefined();
			expect(data.length).toBeGreaterThan(0);
			expect(data[0].author.login).toBeDefined();
		})
	})

	it('returns contributors\' data for desired months from storage', () => {
		return getContribsLastMonth(org, repo, forMonths)
		.then((data) => {
			expect(data).toBeDefined();
			expect(data.length).toBeGreaterThan(0);
			expect(data[0].author.login).toBeDefined();
		})
	})
	
})