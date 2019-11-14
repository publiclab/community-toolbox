/* eslint-disable no-undef */
// Import required modules
const {
  withinThisWeek
} = require('../../src/utils/recentContribsUtil/withinThisWeekOrNot');

describe('withinThisWeekOrNot.js', () => {
  let queryTime;

  beforeAll(() => {
    // Initialize variables
    queryTime = new Date();
  });

  // ====================== TESTS ========================
  it('checks if the given timestamp is within this week or not', () => {
    const result = withinThisWeek(queryTime);
    expect(result).toBeDefined();
    expect(result).toBeTruthy();
  });
});
