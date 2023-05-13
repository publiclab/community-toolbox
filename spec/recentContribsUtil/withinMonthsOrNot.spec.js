/* eslint-disable no-undef */
// Import required modules
const {
  withinMonths
} = require('../../src/utils/recentContribsUtil/withinMonthsOrNot');

describe('withinMonthsOrNot.js', () => {
  let queryTime, monthsNum;

  beforeAll(() => {
    // Initialize variables
    queryTime = new Date();
    monthsNum = 1;
  });

  // ====================== TESTS ========================
  it('checks if the given timestamp is within desired months or not', () => {
    const result = withinMonths(queryTime, monthsNum);
    expect(result).toBeDefined();
    expect(result).toBeTruthy();
  });
});
