let filterUtil = require('../src/utils/filterUtil');

describe('utils/filterUtil.js', () => {

    let org, type;
    let response = [];

    beforeAll(() => {
        org = "publiclab";
        type = "mostrecentfirst";
        response.date = new Date();
    })


    // ====================== TESTS ========================


    it('testing show filtered data', () => {
        let result = filterUtil.showFilteredData(org, type, response);
        expect(result).toBeDefined();
    })


})
