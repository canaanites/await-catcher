import awaitCatcher from "../src/index";

describe('Await-catcher tests', () => {
    // const testApiCall = () => {
    //     return new Promise((resolve, reject) => {
    //         resolve('SUCCESS');
    //     })
    // }

    it('Returns an error if function passed to await-catcher does not return a promise', async (done) => {
        let [ data, error ] = await awaitCatcher('BAD INPUT');
        expect(data).toBe(undefined);
        expect(error).toEqual(new Error("Wrong input... not a promise!"));
        done();
    })
});