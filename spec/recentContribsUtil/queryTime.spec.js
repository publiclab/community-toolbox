/* eslint-disable no-undef */
// Import required modules
const {
  findMonthInd
} = require('../../src/utils/recentContribsUtil/queryTime');

describe('queryTime.js', () => {
  let queryTime;

  beforeAll(() => {
    // Initialize variables
    queryTime = '2019-07-08T23:37:36Z';
  });

  // ====================== TESTS ========================
  it('finds the diff of given timestamp in terms of months', () => {
    const result = findMonthInd(queryTime);
    expect(result).toBeDefined();
    expect(result).toBeGreaterThan(0);
  });
});
