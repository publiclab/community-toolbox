let recentContributors = require('../src/UI/recentContributorsUI');

describe('UI/recentContributorsUI.js', () => {

    let AllContributors ;
    beforeAll(() => {


        // ====================== TESTS ========================


        it('testing recentContributors', () => {
            let result = recentContributors.insertRecentContributors(AllContributors);
            expect(result).toBeDefined();
        })


    })

})