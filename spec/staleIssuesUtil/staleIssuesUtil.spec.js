/* eslint-disable no-undef */
// Import required modules
const staleIssuesUtil = require('../../src/utils/staleIssuesUtil');
const modelUtils = require('../../src/models/utils');
const { when } = require('jest-when');
const { getFakeIssuesList } = require('../helper');

describe('staleIssuesUtil.js', () => {
  let issuesList;

  beforeAll(() => {
    // Initializing variables
    org = 'publiclab';
    repo = 'plots2';
    issuesList = getFakeIssuesList();

    // Fetch call is mocked
    fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: function () {
          return issuesList;
        }
      })
    );

    // Database operations are mocked

    // 2. getItem function is mocked and its behavior depends on the parameter it is called with
    model_utils.getItem = jest.fn();
    when(model_utils.getItem)
      .calledWith('staleIssues-time')
      .mockReturnValue(() => {
        return new Promise((resolve, reject) => {
          const curr = (new Date()).getTime();
          resolve(curr);
        });
      })
      .calledWith('staleIssues')
      .mockReturnValue(() => {
        return new Promise((resolve, reject) => {
          resolve(null);
        });
      });
  });

  // 2. getItem function is mocked and its behavior depends on the parameter it is called with
  modelUtils.getItem = jest.fn();
  when(modelUtils.getItem)
    .calledWith('staleIssues-time')
    .mockReturnValueOnce(() => {
      return new Promise((resolve, reject) => {
        const curr = new Date().getTime();
        resolve(curr);
      });
    })
    .calledWith('staleIssues')
    .mockReturnValueOnce(() => {
      return new Promise((resolve, reject) => {
        resolve(null);
      });
    });
});

// ====================== TESTS ========================

test('fetches repo stale issues list', () => {
  return staleIssuesUtil.getRepoStaleIssues(org, repo)
    .then((data) => {
      expect(data).toBeDefined();
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThanOrEqual(0);
    });
});

it('fetches stale issues list', () => {
  return staleIssuesUtil.getStaleIssues(org, repo)
    .then((data) => {
      expect(data).toBeDefined();
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThanOrEqual(0);
    });
});
