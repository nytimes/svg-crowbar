var svgs = d3.selectAll("svg"),
    doctype = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">',
    info = [],
    sources = [],
    styles = "",
    styleSheets = window.document.styleSheets;

for (var i = 0; i < styleSheets.length; i++) {
  processStyleSheet(styleSheets[i]);
}

function processStyleSheet(ss) {
  for (var i = 0; i < ss.cssRules.length; i++) {
    var rule = ss.cssRules[i];
    if (rule.type === 3) {
      // Import Rule
      processStyleSheet(rule.styleSheet);
    } else {
      styles += "\n" + rule.cssText;
    }
  }
}

// Find all svg nodes
svgs.each(function() {
  var svg = d3.select(this);
  svg.attr("xmlns", d3.ns.prefix.svg)
      .attr("version", "1.1")
    .insert("defs", ":first-child")
    .append("style")
      .attr("type", "text/css");

  var source = (new XMLSerializer()).serializeToString(svg.node()).replace('</style>', '<![CDATA[' + styles + ']]></style>');
  sources.push([doctype + source]);
  info.push({
    bbox: svg.node().getBoundingClientRect(),
    class: svg.attr("class"),
    id: svg.attr("id"),
    childElementCount: svg.node().childElementCount
  })
});

chrome.extension.sendMessage({
  svgs: info
});

// This listens for the user's choice in the popup.
// The download has to run here and not in the popover otherwise the save dialog automatically gets dismissed.
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
  var url = URL.createObjectURL(new Blob(sources[request.id], { "type" : "text\/xml" }));

  var a = d3.select("body")
      .append('a')
      .attr("download", "untitled.svg")
      .attr("href", url)
      .style("display", "none");

  a.node().click();
});

