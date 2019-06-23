# await-catcher

Will be updated very soon!



-----
# Install and use
`npm install await-catcher`

-----
# Example

    interface promiseType {
         test: string
     }

     (async () => {
         let p = Promise.resolve({test: "hi mom"})
         
         let [ data , error ] = await awaitCatcher<promiseType>(p);
         
         console.log(data, error);
     })()
