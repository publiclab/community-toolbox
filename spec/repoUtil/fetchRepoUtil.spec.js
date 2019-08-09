// Import required modules
let fetchRepoUtil = require('../../src/utils/repoUtil/fetchRepoUtil')
let model_utils = require('../../src/models/utils')

describe('fetchRepoUtil.js' , () => {
    let org;

    beforeAll(() => {
        // Initializing variable
        org = "publiclab";

        // Fetch call is mocked
        fetch = jest.fn(() => new Promise((resolve, reject) => {
            resolve({
                    ok: true,
                    status: 200,
                    json: function() {
                        return [
                            'repo1',
                            'repo2',
                            'repo3'
                        ]
                    }
                })
        }));

        // Database operations are mocked here
        model_utils.setItem = jest.fn(() => {return true});
    })


	// ====================== TESTS ========================

    it('contains an array of repositories\'s names', () => {
        return fetchRepoUtil.getAllRepos(org).then((repos) => {
            expect(repos).toBeDefined();
            expect(Array.isArray(repos)).toBe(true);
            expect(repos.length).toBeGreaterThan(0);
        })
    })

})