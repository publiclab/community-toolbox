// Import required modules
let staleIssuesUtil = require('../../src/utils/staleIssuesUtil')
let model_utils = require('../../src/models/utils')
const { when } = require('jest-when')
let { getFakeIssuesList } = require('../helper')

describe('staleIssuesUtil.js', () => {
	let org, repo, issuesList;

	beforeAll(() => {
		// Initializing variables
		org = "publiclab";
		repo = "plots2";
		issuesList = getFakeIssuesList();

		// Fetch call is mocked
        fetch = jest.fn(() => Promise.resolve({
            ok: true,
            status: 200,
            json: function() {
                return issuesList;
			}
		}))
		

		// Database operations are mocked
		
		// 1. setItem is mocked
		model_utils.setItem = jest.fn(() => {return true})

		// 2. getItem function is mocked and its behavior depends on the parameter it is called with
		model_utils.getItem = jest.fn();
		when(model_utils.getItem)
		.calledWith("staleIssues-time")
		.mockReturnValueOnce(() => {
            return new Promise((resolve, reject) => {
				let curr = (new Date).getTime();
                resolve(curr);
            })
        })
		.calledWith("staleIssues")
		.mockReturnValueOnce(() => {
            return new Promise((resolve,reject) => {
                resolve(null);
            })
		})
	})


	// ====================== TESTS ========================

	it('fetches stale issues list', () => {
		return staleIssuesUtil.getStaleIssues(org, repo)
		.then((data) => {
			expect(data).toBeDefined();
			expect(Array.isArray(data)).toBe(true);
			expect(data.length).toBeGreaterThanOrEqual(0);
		})
	})


})