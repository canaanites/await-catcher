import { awaitCatcher } from "../src/index";

describe('Await-catcher tests', () => {
    // const testApiCall = () => {
    //     return new Promise((resolve, reject) => {
    //         resolve('SUCCESS');
    //     })
    // }
    
    // describe('Bad input error tests', () => {
    //     it('Returns an error if value passed to await-catcher is not a promise or a function or an object', async (done) => {
    //         let [ data, error ] = await awaitCatcher('BAD INPUT');
    //         expect(data).toBe(undefined);
    //         expect(error).toEqual(new Error("Wrong input... not a promise!"));
    //         done();
    //     });

    //     it(`Returns an error if value passed to await-catcher is an object but does not have a promise or function as it's first key`, async (done) => {
    //         let [ data, error ] = await awaitCatcher({ key: 'BAD INPUT' });
    //         expect(data).toBe(undefined);
    //         expect(error).toEqual(new Error("Wrong input... not a promise!"));
    //         done();
    //     });

    //     it(`Returns both 'data' and 'error' undefined if value passed to await-catcher is a promise that resolves to undefined`, async (done) => {
    //         let [ data, error ] = await awaitCatcher(Promise.resolve(undefined));
    //         expect(data).toBe(undefined);
    //         expect(error).toBe(undefined);
    //         done();
    //     });
    // });

    describe('When passed a promise', () => {
        it(`Returns the resolved value as the 'data' key if promise resolves successfully`, async (done) => {
            const testPromise = Promise.resolve('Success');
            let [ data, error ] = await awaitCatcher(testPromise);

            expect(data).toBe('Success');
            expect(error).toBe(undefined);
            done();  
        });

        it(`Returns the error if promise is rejected`, async (done) => {
            const testPromise = Promise.reject('Test Error');
            let [ data, error ] = await awaitCatcher(testPromise);

            expect(data).toBe(undefined);
            expect(error).toBe('Test Error');
            done();  
        });
    });


    describe('When passed a function that returns promise', () => {
        it(`Returns the resolved value if promise resolves successfully`, async (done) => {
            const testFunctionThatReturnsPromise = () => Promise.resolve('Success');
            let [ data, error ] = await awaitCatcher(testFunctionThatReturnsPromise);

            expect(data).toBe('Success');
            expect(error).toBe(undefined);
            done();  
        });

        it(`Returns the error if promise is rejected`, async (done) => {
            const testPromise = () => Promise.reject('Test Error');
            let [ data, error ] = await awaitCatcher(testPromise);

            expect(data).toBe(undefined);
            expect(error).toBe('Test Error');
            done();  
        });
    });

    describe('When passed an object with key containing a promise', () => {
        it(`Returns the resolved value if promise resolves successfully`, async (done) => {
            const testObjectContainingPromise = { testKey: Promise.resolve('Success') };
            let [ data, error ] = await awaitCatcher(testObjectContainingPromise);

            expect(data).toBe(testObjectContainingPromise);
            expect(error).toBe(undefined);
            done();  
        });

        // it(`Returns the error if promise is rejected`, async (done) => {
        //     const testPromise = { testkey: Promise.reject('Test Error') };
        //     let [ data, error ] = await awaitCatcher(testPromise);

        //     expect(data).toBe(undefined);
        //     expect(error).toBe(testPromise);
        //     done();  
        // });
    });

    describe('When passed an object with key containing a function that returns a promise', () => {
        it(`Returns the resolved value if promise resolves successfully`, async (done) => {
            const testObjectContainingFunctionThatReturnsPromise = { testKey: () => Promise.resolve('Success') };
            let [ data, error ] = await awaitCatcher(testObjectContainingFunctionThatReturnsPromise);

            expect(data).toBe(testObjectContainingFunctionThatReturnsPromise);
            expect(error).toBe(undefined);
            done();  
        });

        // it(`Returns the error if promise is rejected`, async (done) => {
        //     const testPromise = { testkey: () => Promise.reject('Test Error') };
        //     let [ data, error ] = await awaitCatcher(testPromise);

        //     expect(data).toBe(undefined);
        //     expect(error).toBe(testPromise);
        //     done();  
        // });
    });

});