// Import required modules
let model_utils = require('../../src/models/utils')
let monthsQuery = require('../../src/utils/recentContribsUtil/queryTime')
let { fetchAllRecentMonthContribs } = require('../../src/utils/recentContribsUtil/fetchAllRecentMonthContribs')
let fetchRecentMonthContribs = require('../../src/utils/recentContribsUtil/fetchRecentMonthContribs')
let { getFakeContribsData, getFakeReposList } = require('../helper')


describe('fetchAllRecentMonthContribs.js', () => {
	let org, queryTime,  monthInd;
	let repos, contribs;

	beforeAll(() => {
		// Initialize with random data
		org = "publiclab";
		queryTime = "2019-07-08T23:37:36Z";
		monthInd = 1;
		contribs = getFakeContribsData();
		repos = getFakeReposList();

		// Database operation is mocked
		model_utils.setItem = jest.fn(() => {return true})
		
		// Mock for utility functions
		monthsQuery.findMonthInd = jest.fn(() => {return monthInd})
		fetchRecentMonthContribs.fetchRecentMonthContribs = jest.fn(() => Promise.resolve(contribs))

	})


	// ====================== TESTS =======================

	it('returns all the contributors for all the major repos', () => {
		return fetchAllRecentMonthContribs(org, repos, queryTime)
		.then((data) => {
			expect(data).toBeDefined();
			expect(Array.isArray(data)).toBe(true);
			expect(data.length).toBeGreaterThan(0);
			expect(data[0].author.login).toBeDefined();
		})
	})


})