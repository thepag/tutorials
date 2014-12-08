# React : Drag & Drop

Used the react.js dev tools to build the `js` folder from teh `jsx` folder.

```
jsx --extension jsx --watch jsx/ js/
```

## Reference

### React.js

- [React.js](http://facebook.github.io/react/)
- [Starter Kit](http://facebook.github.io/react/docs/getting-started.html)

### Drag & Drop Tutorial

The reference example uses CoffeeScript and lodash... So I removed that and left it as JavaScript and React.

I also updated the lib to React 0.12.1 and cleaned up the many 'undefined' classes being added all over the place.
Apparently, coffeeScript likes using `void 0` instead of a simple emply string, which then came through as an `undefined` class name.

- KENT WILLIAM INNHOLT [RICH DRAG-AND-DROP IN REACT.JS](http://kentwilliam.com/articles/rich-drag-and-drop-in-react-js)
- github.com/[kentwilliam/react-drag-and-drop-example](https://github.com/kentwilliam/react-drag-and-drop-example)
