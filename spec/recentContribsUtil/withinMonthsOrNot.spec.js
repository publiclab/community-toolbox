let { within_months } = require('../../src/utils/recentContribsUtil/withinMonthsOrNot')

describe('withinMonthsOrNot.js', () => {
	let queryTime, monthsNum;

	beforeAll(() => {
		queryTime = new Date();
		monthsNum = 1;
	})

	it('checks if the given timestamp is within desired months or not', () => {
		let result = within_months(queryTime, monthsNum);
		expect(result).toBeDefined();
		expect(result).toBeTruthy();
	})
})