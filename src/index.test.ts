import awaitCatcher from "./index";

describe('Await-catcher tests', () => {
    // const testApiCall = () => {
    //     return new Promise((resolve, reject) => {
    //         resolve('SUCCESS');
    //     })
    // }

    it('Returns an error if function passed to await-catcher does not return a promise', async (done) => {
        let { error } = await awaitCatcher('BAD INPUT', false);
        expect(error).toBe('Wrong input... not a promise!');
        done();
    })
});