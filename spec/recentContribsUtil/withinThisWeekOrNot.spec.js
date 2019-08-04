// Import required modules
let { within_this_week } = require('../../src/utils/recentContribsUtil/withinThisWeekOrNot')

describe('withinThisWeekOrNot.js', () => {
	let queryTime;

	beforeAll(() => {
		// Initialize variables
		queryTime = new Date();
	})


	// ====================== TESTS ========================
	it('checks if the given timestamp is within this week or not', () => {
		let result = within_this_week(queryTime);
		expect(result).toBeDefined();
		expect(result).toBeTruthy();
	})
})