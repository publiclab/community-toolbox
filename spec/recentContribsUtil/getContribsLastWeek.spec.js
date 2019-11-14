/* eslint-disable no-undef */
// Import required modules
const modelUtils = require('../../src/models/utils');
const {
  getContribsLastWeek
} = require('../../src/utils/recentContribsUtil/getContribsLastWeek');
const getContribsLastMonth = require('../../src/utils/recentContribsUtil/getContribsLastMonth');
const withinThisWeekOrNot = require('../../src/utils/recentContribsUtil/withinThisWeekOrNot');
const { when } = require('jest-when');
const { getFakeContribsData } = require('../helper');

describe('getContribsLastWeek.js', () => {
  let org, repo;
  let contribs;

  beforeAll(() => {
    // Initialize variables
    org = 'publiclab';
    repo = 'plots2';
    contribs = getFakeContribsData();

    // Database operations mocked
    // 1. setItem is mocked
    modelUtils.setItem = jest.fn(() => {
      return true;
    });

    // 2. getItem function is mocked and its behavior depends on the parameter it is called with
    modelUtils.getItem = jest.fn();
    when(modelUtils.getItem)
      .calledWith(`recent-${repo}-week-expiry`)
      .mockReturnValueOnce(() => Promise.resolve(null))
      .mockReturnValueOnce(() => Promise.resolve(null))

      .calledWith(`recent-${repo}-week-commits`)
      .mockReturnValueOnce(() => Promise.resolve(null))
      .mockReturnValueOnce(() => Promise.resolve(contribs));

    // Other utility functions are mocked
    getContribsLastMonth.getContribsLastMonth = jest.fn(() =>
      Promise.resolve(contribs)
    );
    withinThisWeekOrNot.withinThisWeek = jest.fn(() => {
      return true;
    });
  });

  // ====================== TESTS ========================

  it('fetches contributors for last week - fetching from getContribsLastMonth', () => {
    return getContribsLastWeek(org, repo).then(data => {
      expect(data).toBeDefined();
      expect(data.length).toBeGreaterThan(0);
      expect(data[0].author.login).toBeDefined();
    });
  });

  it('fetches contributors for desired week - returns the stored response', () => {
    return getContribsLastWeek(org, repo).then(data => {
      expect(data).toBeDefined();
      expect(data.length).toBeGreaterThan(0);
      expect(data[0].author.login).toBeDefined();
    });
  });
});
