/**
 * The argument passed into the awaitCatcher
 */
type PromiseArg<T> = T | Promise<T> | ReturnType<()=> ()=> Promise<T>>;

/**
 * The promise returned from awaitCatcher contianing an array of [data | undefined, error | undefined]
 */
type PromiseReturn<T> = Promise<[T | undefined, Error | undefined]>;

/**
 * Helper for async/await error handling. Resolves a promise and passes an error if one exists. Promises of any type with any return value are allowed.
 * @param promise 1) a promise, or
 *                2) a function that returns a promise, or 
 *                3) an object that contains either a promise or a function that returns a promise
 */  
export const awaitCatcher = <T>(promise: PromiseArg<T>): PromiseReturn<T> => {
    /**
     * Types
     */
    type Settings = {
        error: Promise<[undefined, Error]>,
        getPromise: Promise<any> | undefined
    }

    const settings: Settings = { 
        error: Promise.resolve([
            undefined, 
            new Error("Wrong input... not a promise!")
        ]),
        getPromise: undefined
    };

    /**
     * Check if
     *  1) is not an Object
     *  2) is not a Function
     *  3) is not a Promise
     * 
     * ---> Promisify the promise arg
     */
    if ( !(promise instanceof Promise) && !(promise instanceof Function) && !(promise instanceof Object) ) 
            promise = Promise.resolve(promise);

    /**
     * Check if
     *  1) is not a Promise
     *  2) is an object that does NOT include either a Promise nor a Function in the first Object Key!! 
     */
    // if (!(promise instanceof Promise)
    //     && promise instanceof Object
    //     && Object.keys(promise).length > 0 
    //     && !(promise[Object.keys(promise)[0]] instanceof Promise)
    //     && !(promise[Object.keys(promise)[0]] instanceof Function)) 
    //         return settings.error;

    /**
     * Check if
     *  --> is a function and invoke the function
     *  --> the function should return a promise
     * Then set the promise
     */
    if ( promise instanceof Function ) {
        let p = promise();

        if (p.then && p instanceof Promise)
            settings.getPromise = Promise.resolve(p);
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
     *  --> the object should contain a promise OR a function (that returns a promise) in the first key of the object
     * 
     *  if it's a function --> invoke it and set the promise
     *  if it's a promise --> just set it
     */
    else if ( promise instanceof Object ) {
        const isFunction = promise[Object.keys(promise)[0]] instanceof Function;

        if (isFunction) {
            settings.getPromise = Promise.resolve(promise[Object.keys(promise)[0]]()) ;
        } else {
            settings.getPromise = Promise.resolve(promise[Object.keys(promise)[0]]);
        }
    }

    /**
     * if getPromise is still undefined --> return error
     */
    // if (settings.getPromise === undefined)
    //     return settings.error;

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

export default awaitCatcher;


/**
 * test...
 * uncomment one at a time...
 */
// interface promiseType {
//     // (): Promise<{test: number}>
//     // [key: string]: number
//     // [key: string]: string
//     // [key: string]: ()=>Promise<{[key: string]: number}>
// }
// type pt = Array<number>;
// type pf = Promise<{[key: string]: number}>;

// (async () => {
//     let p = [123, 321]
//     // let p = Promise.resolve({a:1})
//     // let p = () => Promise.resolve({test:1});
//     // let p = {f: ()=> Promise.resolve({a:1})}
//     let [ data , error ] = await awaitCatcher<pt>(p);
//     console.log(data, error);
// })()