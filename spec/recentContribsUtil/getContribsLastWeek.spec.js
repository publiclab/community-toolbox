// Import required modules
let model_utils = require('../../src/models/utils')
let {getContribsLastWeek} = require('../../src/utils/recentContribsUtil/getContribsLastWeek')
let getContribsLastMonth = require('../../src/utils/recentContribsUtil/getContribsLastMonth')
let withinThisWeekOrNot = require('../../src/utils/recentContribsUtil/withinThisWeekOrNot')
const { when } = require('jest-when')
let { getFakeContribsData } = require('../helper')


describe('getContribsLastWeek.js', () => {
	let org, repo;
	let contribs;

	beforeAll(() => {
		// Initialize variables
		org = "publiclab";
		repo = "plots2";
		contribs = getFakeContribsData();

		
		// Database operations mocked
		// 1. setItem is mocked
		model_utils.setItem = jest.fn(() => {return true})

		// 2. getItem function is mocked and its behavior depends on the parameter it is called with
		model_utils.getItem = jest.fn();
		when(model_utils.getItem)
		.calledWith(`recent-${repo}-week-expiry`)
		.mockReturnValueOnce(() => Promise.resolve(null))
		.mockReturnValueOnce(() => Promise.resolve(null))
		
		.calledWith(`recent-${repo}-week-commits`)
		.mockReturnValueOnce(() => Promise.resolve(null))
		.mockReturnValueOnce(() => Promise.resolve(contribs))
	
		// Other utility functions are mocked
		getContribsLastMonth.getContribsLastMonth = jest.fn(() => Promise.resolve(contribs))
		withinThisWeekOrNot.within_this_week = jest.fn(() => {return true})
	
	})


	// ====================== TESTS ========================

	it('fetches contributors for last week - fetching from getContribsLastMonth', () => {
		return getContribsLastWeek(org, repo)
		.then((data) => {
			expect(data).toBeDefined();
			expect(data.length).toBeGreaterThan(0);
			expect(data[0].author.login).toBeDefined();
		})
	})

	it('fetches contributors for desired week - returns the stored response', () => {
		return getContribsLastWeek(org, repo)
		.then((data) => {
			expect(data).toBeDefined();
			expect(data.length).toBeGreaterThan(0);
			expect(data[0].author.login).toBeDefined();
		})
	})

})