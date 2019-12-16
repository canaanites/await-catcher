/**
 * The argument passed into the awaitCatcher
 */
type PromiseArg<T> = T | Promise<T> | ReturnType<()=> ()=> Promise<T>>;

/**
 * The promise returned from awaitCatcher contianing an array of [data | undefined, error | undefined]
 */
type PromiseReturn<T> = Promise<[T | undefined, Error | undefined]>;

type options = {
    getByKeys?: String[]; // get key/values from object
    getByKeysAndInvoke?: String[]; // get key/values from object and invoke functions
}

/**
 * Helper for async/await error handling. Resolves a promise and passes an error if one exists. Promises of any type with any return value are allowed.
 * @param promise 1) a promise, or
 *                2) a function that returns a promise, or 
 *                3) an object that contains either a promise or a function that returns a promise, or
 *                4) an array or primitive values (string/number)
 * 
 * @param options [options]
 */  
export async function awaitCatcher <T>(promise: PromiseArg<T>, options?: options): PromiseReturn<T> {
    /**
     * Types
     */
    type Settings = {
        getPromise: Promise<any> | undefined
    }

    const settings: Settings = { 
        getPromise: undefined
    };

    /**
     * Check if
     *  1) is not an Object
     *  2) is not a Function
     *  3) is not a Promise
     * 
     * ---> Promisify the promise argument
     */
    if ( !(promise instanceof Promise) && !(promise instanceof Function) && !(promise instanceof Object) ) 
            promise = Promise.resolve(promise);

    /**
     * Check if
     *  --> is a function and invoke the function
     */
    if ( promise instanceof Function ) {
        try {
            settings.getPromise = Promise.resolve(await promise());
        } catch (err) {
            settings.getPromise = Promise.reject(err);
        }
    } 

    /**
     * else check if
     *  --> is a Promise and set the promise
     */
    else if ( promise instanceof Promise ) {
        settings.getPromise = Promise.resolve(promise);
    } 

    /**
     * else check if
     *  --> is object
     */
    else if ( promise instanceof Object ) {
        try {

            if (options && (options.getByKeys || options.getByKeysAndInvoke)) {
                const keyValues = {};
                for (let key of options.getByKeysAndInvoke ) {
                    if (options.getByKeys)
                        keyValues[key.toString()] = await promise[key.toString()]
                    else 
                    if (options.getByKeysAndInvoke)
                        keyValues[key.toString()] = promise[key.toString()] instanceof Function ? await promise[key.toString()]() : await promise[key.toString()]
                }

                settings.getPromise = Promise.resolve(keyValues);
            } else {
                settings.getPromise = Promise.resolve(promise);
            }
            
        } catch(err) {
            settings.getPromise = Promise.reject(err);
        }
    }

    /**
     * check if getPromise is still undefined
     */
    if (settings.getPromise === undefined)
        settings.getPromise = Promise.reject(new Error('undefined'));

    /**
     * Magic happens here
     */
    return settings.getPromise
      .then<[T, undefined]>((data: T) => [
          data as T,
          undefined
      ])
      .catch<[undefined, Error]>((error: Error) => [
          undefined,
          error
      ])
  };

/**
 * awaitCatcherAsync is a wrapper for awaitCatcher that accepts a callback instead of aysnc/await
 * @param promise 
 * @param cb 
 * @param options 
 */
export async function awaitCatcherAsync<T>(promise: PromiseArg<T>, cb: Function, options?: options): PromiseReturn<T> {
    const [data, error] = await awaitCatcher(promise, options);
    return cb(data, error);
}

export default { awaitCatcher, awaitCatcherAsync };

/**
 * test...
 * uncomment one at a time...
 */
// interface promiseType {
//     // (): Promise<{test: number}>
//     // [key: string]: number
//     // [key: string]: string
//     [key: string]: ()=>Promise<{[key: string]: number}>
// }
// type pt = Array<number>;
// type pf = Promise<{[key: string]: number}>;

// (async () => {
//     // let p = [123, 321]
//     // let p = Promise.resolve({a:1})
//     // let p = () => Promise.resolve({test:1});
//     let p = {f: ()=> Promise.resolve({a:1})}
//     let [ data , error ] = await awaitCatcher<promiseType>(p);
//     console.log(data, error);
// })()


// or
// awaitCatcherAsync('test', (data, error) => console.log(data))