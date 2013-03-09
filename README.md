#svg-crowbar

Extracts SVG nodes and accompanying styles from an HTML document and downloads them as an SVG file.

Requires [d3.js](http://d3js.org)

##Usage
The crowbar grabs the first SVG node in the DOM by default.
```javascript
SVGCrowbar.init();
```

The name of the file defaults to "untitled.svg", but you can pass your own.
```javascript
SVGCrowbar.init("map");
```

You can also pass a CSS selector to target a specific svg node.
```javascript
SVGCrowbar.init("map", "svg.map");
```

##Gotchas
It only works in Chrome.

The crowbar will fetch remote CSS that is included with a link tag, but those that are imported with "@import" are not yet supported.