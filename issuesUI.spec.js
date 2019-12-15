
let  issuesUI  = require('../src/UI/issuesUI');

describe('UI/issuesUI.js', () => {

    let title,body,githubUrl,repos;

    beforeAll(() => {


        title = "issue title";
        body = "issue bodz";
        githubUrl = "www";
        repos = "www";
    })


    // ====================== TESTS ========================



    it('testing generate issue html',() => {
            let result = issuesUI.generateIssueHtml(title,body,githubUrl,repos);
                expect(result).toBeDefined();

            })



})