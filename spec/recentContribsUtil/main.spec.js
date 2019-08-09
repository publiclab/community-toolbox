let getContribsLastMonth = require('../../src/utils/recentContribsUtil/getContribsLastMonth')
let getContribsLastWeek = require('../../src/utils/recentContribsUtil/getContribsLastWeek')
let storeAllRecentContribsInDb = require('../../src/utils/recentContribsUtil/storeAllRecentContribsInDb')
let { getFakeContribsData } = require('../utils')
let {
	fetchContribsLastMonth,
	fetchContribsLastWeek,
	fetchAllRecentContribsInDb
} = require('../../src/utils/recentContribsUtil/main')



describe('main.js', () => {
	let org, repo, forMonths;
	let contribs = getFakeContribsData();

	beforeAll(() => {
		org = "publiclab";
		repo = "plots2";
		forMonths = 6;

		// Utility functions are mocked
		getContribsLastMonth.getContribsLastMonth = jest.fn(() => Promise.resolve(contribs))
		getContribsLastWeek.getContribsLastWeek = jest.fn(() => Promise.resolve(contribs))
		storeAllRecentContribsInDb.storeAllRecentContribsInDb = jest.fn(() => Promise.resolve(contribs))
	})


	it('fetches contributors for desired months by calling getContribsLastMonth', () => {
		return fetchContribsLastMonth(org, repo)
		.then((data) => {
			expect(data).toBeDefined();
			expect(data.length).toBeGreaterThan(0);
			expect(data[0].author.login).toBeDefined();
		})
	})

	it('fetches contributors for last week by calling getContribsLastWeek', () => {
		return fetchContribsLastWeek(org, repo)
		.then((data) => {
			expect(data).toBeDefined();
			expect(data.length).toBeGreaterThan(0);
			expect(data[0].author.login).toBeDefined();
		})
	})
	
	it('fetches and stores all recent contributors by calling fetchAllRecentMonthContribs', () => {
		return fetchAllRecentContribsInDb(org, repo)
		.then((data) => {
			expect(data).toBeDefined();
			expect(data.length).toBeGreaterThan(0);
			expect(data[0].author.login).toBeDefined();
		})
	})




})