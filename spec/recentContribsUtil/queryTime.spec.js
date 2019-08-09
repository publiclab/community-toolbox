let { findMonthInd } = require('../../src/utils/recentContribsUtil/queryTime')


describe('queryTime.js', () => {
	let queryTime;
	beforeAll(() => {
		queryTime = "2019-07-08T23:37:36Z";
	})

	it('finds the diff of given timestamp in terms of months', () => {
		let result = findMonthInd(queryTime);
		expect(result).toBeDefined();
		expect(result).toBeGreaterThan(0);
	})


})