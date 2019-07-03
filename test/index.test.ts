import awaitCatcher from "../src/index";

describe('Await-catcher tests', () => {
    // const testApiCall = () => {
    //     return new Promise((resolve, reject) => {
    //         resolve('SUCCESS');
    //     })
    // }

    it('Returns an error if value passed to await-catcher is not a promise or a function or an object', async (done) => {
        let [ data, error ] = await awaitCatcher('BAD INPUT');
        expect(data).toBe(undefined);
        expect(error).toEqual(new Error("Wrong input... not a promise!"));
        done();
    })

    it(`Returns an error if value passed to await-catcher is an object but does not have a promise or function as it's first key`, async (done) => {
        let [ data, error ] = await awaitCatcher({ key: 'BAD INPUT' });
        expect(data).toBe(undefined);
        expect(error).toEqual(new Error("Wrong input... not a promise!"));
        done();
    })
});