# Promises

Where [can I use Promises?](http://caniuse.com/#feat=promises)

## Terminology

An object that is promise-like may be described as *thenable*, since they have a `then` method.

A promise can be:

* *fulfilled* - The action relating to the promise succeeded.
* *rejected* - The action relating to the promise failed.
* *pending* - The action has not yet fulfilled or rejected.
* *settled* - The action has been fulfilled or rejected.

## Syntax

### Creating a Promise:

```javascript
var promise = new Promise(function(resolve, reject) {
  // perform the action

  if (/* the action was successful */) {
    resolve("Stuff worked!");
  } else {
    reject(Error("It broke"));
  }
});
```

### Using a Promise

```javascript
promise.then(function(result) {
  console.log(result); // "Stuff worked!"
}, function(err) {
  console.log(err); // Error: "It broke"
});
```

## References

* [Mozilla Developer Network](https://developer.mozilla.org/) - [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
* [HTML5 Rocks](http://www.html5rocks.com/) - [JavaScript Promises](http://www.html5rocks.com/en/tutorials/es6/promises/)

## Polyfills

* [promise.js](https://www.promisejs.org/)
