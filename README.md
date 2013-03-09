#svg-crowbar

Extracts SVG nodes and accompanying styles from an HTML document and downloads them as an SVG file.

Requires [d3.js](http://d3js.org)

##Usage
The crowbar grabs the first SVG node in the DOM by default.

```javascript
SVGCrowbar.init();
```

You can alternately pass a CSS selector and a filename to target which node you want to extract.

```javascript
SVGCrowbar.init("svg#map", "map");
```

