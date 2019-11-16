/* eslint-disable no-undef */
// Import required modules
const SimpleApi = require('github-api-simple');
const api = new SimpleApi();
const modelUtils = require('../../src/models/utils');
const {
  fetchAllRepoContribs
} = require('../../src/utils/contribsUtil/fetchAllRepoContribs');
const { getFakeContribsData } = require('../helper');

describe('fetchAllRepoContribs.js', () => {
  let org, repo;
  let contribs;

  beforeAll(() => {
    // Initialize variables
    org = 'publiclab';
    repo = 'plots2';
    contribs = getFakeContribsData();

    // Database operation is mocked
    modelUtils.setItem = jest.fn(() => {
      return true;
    });

    // Other functions are mocked
    api.Repositories.getRepoContributors = jest.fn(() =>
      Promise.resolve(contribs)
    );
  });

  // ====================== TESTS ========================

  it('fetches all the contributors for any repo', () => {
    return fetchAllRepoContribs(org, repo).then(data => {
      expect(data).toBeDefined();
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThan(0);
      expect(data[0].author.login).toBeDefined();
    });
  });
});
