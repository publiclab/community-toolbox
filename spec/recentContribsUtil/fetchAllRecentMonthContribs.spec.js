let model_utils = require('../../src/models/utils')
let monthsQuery = require('../../src/utils/recentContribsUtil/queryTime')
let { fetchAllRecentMonthContribs } = require('../../src/utils/recentContribsUtil/fetchAllRecentMonthContribs')
let fetchRecentMonthContribs = require('../../src/utils/recentContribsUtil/fetchRecentMonthContribs')
let { getFakeContribsData, getReposList } = require('../utils')


describe('fetchAllRecentMonthContribs.js', () => {
	let org, queryTime,  monthInd;

	// Fake response payload
	let contribs = getFakeContribsData();
	let repos = getReposList();

	beforeAll(() => {
		// Provide random data
		org = "publiclab";
		queryTime = "2019-07-08T23:37:36Z";
		monthInd = 1;

		// Database operation mocked
		model_utils.setItem = jest.fn(() => {return true})
		
		// Mock for utility functions
		monthsQuery.findMonthInd = jest.fn(() => {return monthInd})
		fetchRecentMonthContribs.fetchRecentMonthContribs = jest.fn(() => Promise.resolve(contribs))

	})



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