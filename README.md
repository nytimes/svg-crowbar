#svg-crowbar

Extracts SVG nodes and accompanying styles from an HTML document and downloads them as an SVG file.

Requires [d3.js](http://d3js.org)

##Usage

```javascript
SVGCrowbar.init();
```

will grab all SVG nodes.

```javascript
SVGCrowbar.init("#map");
```

You can optionally pass a CSS selector.
