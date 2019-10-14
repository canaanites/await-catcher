# await-catcher

[![NPM version][npm-image]][npm-url]
[![Downloads][download-badge]][npm-url]

> Promise wrapper for easy error handling without try-catch

-----
# Install and use
```sh
npm i await-catcher --save
```

-----
# Usage
```text
 1) Type checking with typeScript generics
 2) Cleaner & less code
 3) Dynamic variable names, accepts all data types, and more...
```

```js
/** 
 *  #1 - Type checking with typeScript generics 
 */
interface promiseType_1 {
     test: string
 }

 (async () => {
     let p = Promise.resolve({test: "hi mom"})

     let [ data , error ] = await awaitCatcher<promiseType_1>(p);

     console.log(data, error); // "hi mom, undefined 
 })()


type promiseType_2 = Array<number>;

 (async () => {
     let p = [123, 321];

     let [ data , error ] = await awaitCatcher<promiseType_2>(p);
     console.log(data, error); // "hi mom, undefined 

     let p2 = [123, "string"];
     let [ data , error ] = await awaitCatcher<promiseType_2>(p); // Type error: Type 'string' is not assignable to type 'number'
 })()
```

```js
/** 
 *  #2 - Cleaner and less code
 *
 *  Makes the code easier to read by eliminating the need to use try/catch
 */

const confirmUserEmailById = async (userId) => {
    const userData; 
    try {
      userData = await UserModel.findById(userId);
    } catch (err) {
      console.log(err)
    }

    if (!data) {
      return;
    }

    const ticketId; 
    try {
      ticketId = await sendEmailTo(userData.email);
    } catch (err) {
      console.log(err)
    }

    if (!ticketId) {
      return;
    }

    return `Confirmation has been sent to ${userData.email} successfully. The support ticket number is ${ticketId}`;
} 

// Now you can do it like this...

const confirmUserEmailById = async (userId) => {
    const [ userData, userError ] = await awaitCatcher( UserModel.findById(userId) );
    if (!userData || userError) return console.log(userError);

    const [ ticketId, ticketError] = await awaitCatcher( sendEmailTo(userData.email) );
    if (!ticketId || ticketError return console.log(ticketError);

    return `Confirmation has been sent to ${userData.email} successfully. The support ticket number is ${ticketId}`;

}
```

```js
/** 
 *  #3 - Dynamic variable names & the supported data types
 *
 *  awaitCatcher returns an array of [ data, error ] like this --> Either [ undefined, error ] or [ data, undefined ].
 *
 *  Therefore, you can utilize the destructuring array feature in ES6 to name the returned value whatever you like.
 * 
 *  The below 4 examples demonstrate some of the data types that awaitCatcher() can handle
 */
// 1)
let data, error;
[ data, error ] = await awaitCatcher("I can pass anything to awaitCatcher :)");
console.log(data, error); // "I can pass anything to awaitCatcher", undefined

// 2)
// notice the same declared varibleables (data & error) were reused
[ data, error ] = await awaitCatcher(Promise.reject("I don't need try/catch to handle rejected promises"))
console.log(data, error); // undefined, "I don't need try/catch to handle rejected promises"

// 3)
// other variable names can be used whenever needed
const [ anyVarName_data, anyVarName_error ] = await awaitCatcher( () => Promise.resolve("I can pass functions that return promises") )
console.log(anyVarName_data, anyVarName_error); // "I can pass functions that return promises", undefined

// 4)
// you can also pass an object that contains a key/value of a function that returns a promise (This only works on the first key/value of the object)
[ data, error ] = await awaitCatcher( { p: () => Promise.resolve("awaitCatcher will be able to find and handle this promise")} )
console.log(data, error); // ""awaitCatcher will be able to find and handle this promise", undefined
```


[npm-url]: https://www.npmjs.com/package/await-catcher
[npm-image]: https://img.shields.io/npm/v/await-catcher.svg?style=flat-square

[travis-url]: https://travis-ci.org/scopsy/await-catcher
[travis-image]: https://img.shields.io/travis/scopsy/await-catcher.svg?style=flat-square

[coveralls-url]: https://coveralls.io/r/scopsy/await-catcher
[coveralls-image]: https://img.shields.io/coveralls/scopsy/await-catcher.svg?style=flat-square

[depstat-url]: https://david-dm.org/scopsy/await-catcher
[depstat-image]: https://david-dm.org/scopsy/await-catcher.svg?style=flat-square

[download-badge]: http://img.shields.io/npm/dm/await-catcher.svg?style=flat-square
