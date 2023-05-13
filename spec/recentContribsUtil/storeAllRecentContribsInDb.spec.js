/* eslint-disable no-undef */
// Import required modules
const fetchAllRecentMonthContribs = require('../../src/utils/recentContribsUtil/fetchAllRecentMonthContribs');
const fetchRepoUtil = require('../../src/utils/repoUtil/fetchRepoUtil');
const modelUtils = require('../../src/models/utils');
const {
  storeAllRecentContribsInDb
} = require('../../src/utils/recentContribsUtil/storeAllRecentContribsInDb');
const { when } = require('jest-when');
const { getFakeContribsData, getFakeReposList } = require('../helper');

describe('storeAllRecentContribsInDb.js', () => {
  let org, repo;
  let repos, contribs;

  beforeAll(() => {
    // Initialize variables
    org = 'publiclab';
    repo = 'plots2';
    repos = getFakeReposList();
    contribs = getFakeContribsData();

    // Database operations are mocked
    // 1. setItem is mocked
    modelUtils.setItem = jest.fn(() => {
      return true;
    });

    // 2. getItem function is mocked and its behavior depends on the parameter it is called with
    modelUtils.getItem = jest.fn();
    when(modelUtils.getItem)
      .calledWith('repos')
      .mockReturnValueOnce(() => Promise.resolve(repos))

      .calledWith('recent-present')
      .mockReturnValueOnce(() => Promise.resolve(null));

    // Other utility functions are mocked
    fetchAllRecentMonthContribs.fetchAllRecentMonthContribs = jest.fn(() =>
      Promise.resolve(contribs)
    );
    fetchRepoUtil.getAllRepos = jest.fn(() => Promise.resolve(repos));
  });

  // ====================== TESTS ========================

  it('stores all recent contributors in the database by calling fetchAllRecentConribsInDb', () => {
    return storeAllRecentContribsInDb(org, repo).then(data => {
      expect(data).toBeDefined();
      expect(data.length).toBeGreaterThan(0);
      expect(Array.isArray(data)).toBe(true);
    });
  });
});
