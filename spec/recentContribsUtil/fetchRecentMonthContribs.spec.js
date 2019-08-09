let model_utils = require('../../src/models/utils')
let monthsQuery = require('../../src/utils/recentContribsUtil/queryTime')
let withinMonthsOrNot = require('../../src/utils/recentContribsUtil/withinMonthsOrNot')
let freshFetch = require('../../src/utils/recentContribsUtil/freshFetch')
let { fetchRecentMonthContribs } = require('../../src/utils/recentContribsUtil/fetchRecentMonthContribs')
let { when } = require('jest-when')
let { getFakeContribsData } = require('../utils')


describe('fetchRecentMonthContribs.js', () => {
	let org, repo, queryTime, monthInd;

	// Fake response payload
	let contribs = getFakeContribsData();

	beforeAll(() => {
		// Provide random data
		org = "publiclab";
		repo = "plots2";
		queryTime = "2019-07-08T23:37:36Z";
		monthInd = 1;

		// Database operations mocked
		// 1. setItem is mocked
		model_utils.setItem = jest.fn(() => {return true})

		// 2. getItem function is mocked and its behavior depends on the parameter it is called with
		model_utils.getItem = jest.fn();
		when(model_utils.getItem)
		.calledWith(`recent-${repo}-${monthInd}-month-commits`)
		.mockReturnValue(() => Promise.resolve(null))
		
		.calledWith(`recent-${repo}-6-month-commits`)
		.mockReturnValueOnce(() => Promise.resolve(contribs))
		.mockReturnValueOnce(() => Promise.resolve(null))

		// Mock for utility functions
		withinMonthsOrNot.within_months = jest.fn(() => {return true})
		monthsQuery.findMonthInd = jest.fn(() => {return monthInd})
		freshFetch.freshFetch = jest.fn(() => Promise.resolve(contribs))

	})



	it('returns contributors for desired months using stored data', () => {
		return fetchRecentMonthContribs(org, repo, queryTime)
		.then((data) => {
			expect(data).toBeDefined();
			expect(Array.isArray(data)).toBe(true);
			expect(data.length).toBeGreaterThan(0);
			expect(data[0].author.login).toBeDefined();
		})
	})

	it('returns contributors for desired months by making a fresh call', () => {
		return fetchRecentMonthContribs(org, repo, queryTime)
		.then((data) => {
			expect(data).toBeDefined();
			expect(Array.isArray(data)).toBe(true);
			expect(data.length).toBeGreaterThan(0);
			expect(data[0].author.login).toBeDefined();
		})
	})




})