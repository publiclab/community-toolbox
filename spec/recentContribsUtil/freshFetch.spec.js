/* eslint-disable no-undef */
// Import required modules
const modelUtils = require('../../src/models/utils');
const monthsQuery = require('../../src/utils/recentContribsUtil/queryTime');
const { freshFetch } = require('../../src/utils/recentContribsUtil/freshFetch');
const { getFakeContribsData } = require('../helper');

describe('freshFetch.js', () => {
  let org, repo, queryTime;
  let contribs;

  beforeAll(() => {
    org = 'publiclab';
    repo = 'plots2';
    queryTime = '2019-07-08T23:37:36Z';
    contribs = getFakeContribsData();

    // Fetch call is mocked
    fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: function () {
          return contribs;
        }
      })
    );

    // Other functions are mocked
    monthsQuery.findMonthInd = jest.fn(() => {
      return 1;
    });
    modelUtils.setItem = jest.fn(() => {
      return true;
    });
  });

  // ====================== TESTS ========================

  it('makes a fresh call to the github API for contributors', () => {
    return freshFetch(org, repo, queryTime).then(data => {
      expect(data).toBeDefined();
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThan(0);
      expect(data[0].author.login).toBeDefined();
    });
  });
});
