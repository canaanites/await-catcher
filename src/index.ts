/**
 * Helper for async/await error handling. Resolves a promise and passes an error if one exists. Promises of any type with any return value are allowed.
 * @param promise Function or promise
 */
type Settings = {
    keys: {
        getDataKey: string,
        getErrorKey: string
    },
    getPromise: Promise<any>
}

export const awaitCatcher = (promise: any, isDynamicKeys: boolean = false) => {

    const settings: Settings = { 
        keys: undefined,
        getPromise: undefined
    };

    if ( !(promise instanceof Object) && !(promise instanceof Promise) ) 
            return {data: undefined, error: "Wrong input... not a promise!"};

    if (!promise.then && promise instanceof Object
        && Object.keys(promise).length > 0 
        && !(promise[Object.keys(promise)[0]] instanceof Promise)
        && !(promise[Object.keys(promise)[0]] instanceof Function)) 
            return {data: undefined, error: "Wrong input... not a promise!!"};

    if ( promise instanceof Function ) {
        settings.getPromise = promise();
        settings.keys = {
            getDataKey  : promise.prototype.constructor.name && isDynamicKeys ? promise.prototype.constructor.name + "Data"  : "data", 
            getErrorKey : promise.prototype.constructor.name && isDynamicKeys ? promise.prototype.constructor.name + "Error" : "error"
        }
        // console.debug(0, settings);

    } else if ( promise instanceof Promise ) {
        settings.getPromise = promise;
        settings.keys = {
            getDataKey: "data", 
            getErrorKey: "error"
        }
        // console.debug(1, settings);

    } else if ( promise instanceof Object ) {
        const isFunction = promise[Object.keys(promise)[0]] instanceof Function;
        const isPromise = !!promise.then;

        if (isPromise) {
            settings.getPromise = promise;
            settings.keys = {
                getDataKey : "data",
                getErrorKey: "error",
            }
        }
        else {
            settings.getPromise = isFunction ? promise[Object.keys(promise)[0]]() : promise[Object.keys(promise)[0]];
            settings.keys = {
                getDataKey : isFunction ? promise[Object.keys(promise)[0]].prototype.constructor.name + "Data"  : Object.keys(promise)[0] + 'Data',
                getErrorKey: isFunction ? promise[Object.keys(promise)[0]].prototype.constructor.name + "Error" : Object.keys(promise)[0] + 'Error',
            }
        }

        // console.debug(2, settings);
    }

    if (settings.keys === undefined || settings.getPromise === undefined)
        return {data: undefined, error: "Wrong input... not a promise!!!"};

    return settings.getPromise
      .then((data: any) => ({ 
            [settings.keys.getDataKey]: data, 
            [settings.keys.getErrorKey]: undefined 
        }))
      .catch((error: Error) => ({ 
            [settings.keys.getDataKey]: undefined, 
            [settings.keys.getErrorKey]: error 
        }))
  };

export default awaitCatcher;