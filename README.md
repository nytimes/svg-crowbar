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

Some advanced CSS selectors will crash Illustrator. Be warned.
