/* eslint-disable no-undef */
// Import required modules
const main = require('../../src/utils/contribsUtil/main');
const storeAllContribsInDb = require('../../src/utils/contribsUtil/storeAllContribsInDb');
const fetchRepoContribsUtil = require('../../src/utils/contribsUtil/fetchRepoContribsUtil');
const { getFakeContribsData } = require('../helper');

describe('util/contribsUtil/main.js', () => {
  let org, repo;
  let contribsFakeData;

  beforeAll(() => {
    // Initialize variables
    org = 'publiclab';
    repo = 'plots2';
    contribsFakeData = getFakeContribsData();

    // Utility functions are mocked
    storeAllContribsInDb.storeAllContribsInDb = jest.fn(() =>
      Promise.resolve(contribsFakeData)
    );
    fetchRepoContribsUtil.fetchRepoContributorsUtil = jest.fn(() =>
      Promise.resolve(contribsFakeData)
    );
  });

  // ====================== TESTS ========================

  it('testing fetchAllContribsInDb', () => {
    return main.fetchAllContribsInDb(org).then(data => {
      expect(data).toBeDefined();
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThan(0);
    });
  });

  it('testing repoContribsUtil', () => {
    return main.repoContribsUtil(org, repo).then(data => {
      expect(data).toBeDefined();
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThanOrEqual(0);
    });
  });
});
