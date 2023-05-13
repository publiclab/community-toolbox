/* eslint-disable no-undef */
// Import required modules
const SimpleApi = require('github-api-simple');
const api = new SimpleApi();
const modelUtils = require('../../src/models/utils');
const {
  fetchRepoContribs
} = require('../../src/utils/contribsUtil/fetchRepoContribs');
const { getFakeContribsData } = require('../helper');

describe('fetchRepoContribs.js', () => {
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

  it('fetches and stores contributors for specific repo', () => {
    return fetchRepoContribs(org, repo).then(data => {
      expect(data).toBeDefined();
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThanOrEqual(0);
      expect(data[0].author.login).toBeDefined();
    });
  });
});
