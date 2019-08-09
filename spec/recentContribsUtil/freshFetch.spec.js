let model_utils = require('../../src/models/utils')
let monthsQuery = require('../../src/utils/recentContribsUtil/queryTime')
let { freshFetch } = require('../../src/utils/recentContribsUtil/freshFetch')
let { getFakeContribsData } = require('../utils')

describe('freshFetch.js', () => {
	let org, repo, queryTime;

	// Fake response payload
	let contribs = getFakeContribsData();

	beforeAll(() => {
		org = "publiclab";
		repo = "plots2";
		queryTime = "2019-07-08T23:37:36Z";

		// Fetch call is mocked
		fetch = jest.fn(() => Promise.resolve({
			ok: true,
			status: 200,
			json: function() {
				return contribs;
			}
		}))
		
		// Other functions are mocked
		monthsQuery.findMonthInd = jest.fn(() => {return 1})
		model_utils.setItem = jest.fn(() => {return true})
	})


	it('makes a fresh call to the github API for contributors', () => {
		return freshFetch(org, repo, queryTime)
		.then((data) => {
			expect(data).toBeDefined();
			expect(Array.isArray(data)).toBe(true);
			expect(data.length).toBeGreaterThan(0);
			expect(data[0].author.login).toBeDefined();
		})
	})


})