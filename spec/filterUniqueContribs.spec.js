
let  filterUnique  = require('../src/utils/filterUniqueContribs');

describe('utils/filterUniqueContribs.js', () => {

    let data = [];

    beforeAll(() => {
     data[0] = "user1";
     data[1] = "user2"
    })


    // ====================== TESTS ========================



    it('testing filter unique contributors',() => {
        let result = filterUnique.filterUniqueContribs(data);
        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);

    })



})