/* eslint-disable no-undef */
// Import required modules
const fetchRepoUtil = require('../../src/utils/repoUtil/fetchRepoUtil');
const modelUtils = require('../../src/models/utils');
const { getFakeReposList } = require('../helper');

describe('fetchRepoUtil.js', () => {
  let org, repos;

  beforeAll(() => {
    // Initializing variable
    org = 'publiclab';
    repos = getFakeReposList();

    // Fetch call is mocked
    fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: function () {
          return repos;
        }
      })
    );

    // Database operation is mocked
    modelUtils.setItem = jest.fn(() => {
      return true;
    });
  });

  // ====================== TESTS ========================

  it("returns an array of repositories's names", () => {
    return fetchRepoUtil.getAllRepos(org).then(repos => {
      expect(repos).toBeDefined();
      expect(Array.isArray(repos)).toBe(true);
      expect(repos.length).toBeGreaterThan(0);
    });
  });
});
