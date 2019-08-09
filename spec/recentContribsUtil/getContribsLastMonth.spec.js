let model_utils = require('../../src/models/utils')
let fetchAllRecentMonthContribs = require('../../src/utils/recentContribsUtil/fetchAllRecentMonthContribs')
let fetchRecentMonthContribs = require('../../src/utils/recentContribsUtil/fetchRecentMonthContribs')
let {getContribsLastMonth} = require('../../src/utils/recentContribsUtil/getContribsLastMonth')
let when = require('jest-when')
let { getFakeContribsData, getReposList } = require('../utils')


describe('getContribsLastMonth.js', () => {
	let org, repo, forMonths;
	let currTime = (new Date).getTime();

	// Storing fake data
	let repos = getReposList();
	let contribs = getFakeContribsData();


	beforeAll(() => {
		org = "publiclab";
		repo = "plots2";
		forMonths = 6;

		fetchAllRecentMonthContribs.fetchAllRecentMonthContribs = jest.fn(() => Promise.resolve(contribs))
		fetchRecentMonthContribs.fetchRecentMonthContribs = jest.fn(() => Promise.resolve(contribs))

		// Database operations mocked

		// 1. getItem function is mocked and its behavior depends on the parameter it is called with
		model_utils.getItem = jest.fn();
		when.when(model_utils.getItem)
		.calledWith("repos")
		.mockReturnValue(() => Promise.resolve(repos))
		
		.calledWith(`recent-${repo}-${forMonths}-month-expiry`)
		.mockReturnValueOnce(() => Promise.resolve(null))
		.mockReturnValueOnce(() => Promise.resolve(currTime))
		.mockReturnValueOnce(() => Promise.resolve(null))

		.calledWith(`recent-${repo}-${forMonths}-month-commits`)
		.mockReturnValueOnce(() => Promise.resolve(null))
		.mockReturnValueOnce(() => Promise.resolve(null))
		.mockReturnValueOnce(() => Promise.resolve(contribs))

	})


	it('fetches contributors for desired months - test 1', () => {
		return getContribsLastMonth(org, repo, forMonths)
		.then((data) => {
			expect(data).toBeDefined();
			expect(data.length).toBeGreaterThan(0);
			expect(data[0].author.login).toBeDefined();
		})
	})

	it('fetches contributors for desired months - test 2', () => {
		return getContribsLastMonth(org, repo, forMonths)
		.then((data) => {
			expect(data).toBeDefined();
			expect(data.length).toBeGreaterThan(0);
			expect(data[0].author.login).toBeDefined();
		})
	})

	it('fetches contributors for desired months - test 3', () => {
		return getContribsLastMonth(org, repo, forMonths)
		.then((data) => {
			expect(data).toBeDefined();
			expect(data.length).toBeGreaterThan(0);
			expect(data[0].author.login).toBeDefined();
		})
	})
})