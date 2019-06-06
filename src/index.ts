/**
 * Helper for async/await error handling. Resolves a promise and passes an error if one exists. Promises of any type with any return value are allowed.
 * @param promise Function or promise
 */

type data = any;
type error = any;

type Settings = {
    error: [
        data,
        error
    ]
    getPromise: Promise<any>
}

export const awaitCatcher = (promise: any) => {

    const settings: Settings = { 
        error: [
            undefined, 
            "Wrong input... not a promise!"
        ],
        getPromise: undefined
    };


    /**
     * Check if
     *  1) is not an Object
     *  2) is not a Function
     *  3) is not a Promise
     */
    if ( !(promise instanceof Object) && !(promise instanceof Function) && !(promise instanceof Promise) ) 
            return settings.error;

    /**
     * Check if
     *  1) is not a Promise
     *  2) is an object that does NOT include either a Promise nor a Function in the first Object Key!! 
     */
    if ((!promise.then && !(promise instanceof Promise))
        && promise instanceof Object
        && Object.keys(promise).length > 0 
        && !(promise[Object.keys(promise)[0]] instanceof Promise)
        && !(promise[Object.keys(promise)[0]] instanceof Function)) 
            return settings.error;

    /**
     * Check if
     *  --> is a function and invoke the function
     *  --> the function should return a promise
     * Then set the promise
     */
    if ( promise instanceof Function ) {
        let p = promise();

        if (!(p.then && p instanceof Promise))
            settings.getPromise = p;
    } 

    /**
     * else check if
     *  --> is a Promise and set the promise
     */
    else if ( promise instanceof Promise ) {
        settings.getPromise = promise;
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
        const isFunction = promise[Object.keys(promise)[0]] instanceof Function,
              isPromise = !!promise.then && promise instanceof Promise;

        if (isPromise) {
            settings.getPromise = promise;
        } else if (isFunction) {
            settings.getPromise = promise[Object.keys(promise)[0]]();
        } else {
            settings.getPromise = promise[Object.keys(promise)[0]];
        }
    }

    /**
     * if getPromise is still undefined --> return error
     */
    if (settings.getPromise === undefined)
        return settings.error;

    /**
     * Magic happens here
     */
    return settings.getPromise
      .then((data: any) => ([
          data,
          undefined
      ]))
      .catch((error: Error) => ([
          undefined,
          error
      ]))
  };

export default awaitCatcher;