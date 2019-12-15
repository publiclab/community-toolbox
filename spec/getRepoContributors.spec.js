let getRepoContributors = require('../src/utils/getRepoContributors');

describe('utils/getRepoContributors.js', () => {

    let username,repo;
    let options= [];

    beforeAll(() => {
        username="user";
        repo = "repo";
        options["until"] = new Date();
        options["time"] = new Date();
        options["since"] = new Date();
    })


    // ====================== TESTS ========================


    it('testing get repo contributors', () => {
        let result = getRepoContributors.getRepoContributors(username, repo, options);
        expect(result).toBeDefined();
    })

})



